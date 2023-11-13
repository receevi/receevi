import { serve } from "deno-server"
import { corsHeaders } from "../_shared/cors.ts";
import { Broadcast } from "../bulk-send/types.ts";
import { SupabaseClientType, createSupabaseClient } from "../_shared/client.ts";
import { sendTemplateMessage } from "./send-message.ts";

type MessageBatchReq = {
    batchId: string
    broadcast: Broadcast
}

async function sendMessages(supabase: SupabaseClientType, batchId: string, broadcast: Broadcast) {
    const { data: contacts, error } = await supabase
        .from('broadcast_contact')
        .select('*')
        .eq('batch_id', batchId)
        .is('sent_at', null)
        .order('created_at', { ascending: true })
    if (error) throw error
    for (const contact of contacts) {
        const responseData = await sendTemplateMessage(broadcast.template_name, broadcast.language, contact.contact_id.toString())
        console.log(`BroadcastId: ${broadcast.id} - BatchId: ${batchId} - Message sent to: ${contact.contact_id}`)
        if (responseData.messages.length > 0) {
            const message_id = responseData.messages[0].id

            const { error: errorUpdateBroadcastContact } = await supabase
                .from('broadcast_contact')
                .update({ sent_at: new Date(), wam_id: message_id })
                .eq('id', contact.id)
            if (errorUpdateBroadcastContact) throw errorUpdateBroadcastContact

            //TODO: Update sent_count in broadcast table
        }
    }
}

serve(async (req) => {
    const authorizationHeader = req.headers.get('Authorization')!
    const supabase = createSupabaseClient(authorizationHeader)

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return new Response('', { status: 401, headers: corsHeaders })
    }
    const messageBatchReq: MessageBatchReq = await req.json()
    console.log(`BroadcastId: ${messageBatchReq.broadcast.id} - BatchId: ${messageBatchReq.batchId} - Send batch messages received`)
    sendMessages(supabase, messageBatchReq.batchId, messageBatchReq.broadcast)
    console.log(`BroadcastId: ${messageBatchReq.broadcast.id} - BatchId: ${messageBatchReq.batchId} - Send batch messages completed`)
    return new Response(
        '{"success": true"}',
        { headers: { "Content-Type": "application/json", ...corsHeaders } },
    )
})
