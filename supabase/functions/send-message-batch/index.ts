import { serve } from "deno-server"
import { corsHeaders } from "../_shared/cors.ts";
import { Broadcast, BroadcastContact } from "../bulk-send/types.ts";
import { SupabaseClientType, createSupabaseClient } from "../_shared/client.ts";
import { sendTemplateMessage, sendTemplateMessageDummy } from "./send-message.ts";
import { PARALLEL_SEND_MESSAGE_COUNT } from "../_shared/constants.ts";

type MessageBatchReq = {
    batchId: string
    broadcast: Broadcast
}

async function sendMessageAndUpdateMessageId(supabase: SupabaseClientType, broadcast: Broadcast, contact: BroadcastContact) {
    console.log(`BroadcastId: ${broadcast.id} - Sending message to ${contact.contact_id}`)
    try {
        const { payload, response: responseData } = await sendTemplateMessage(broadcast.template_name, broadcast.language, contact.contact_id.toString())
        if (responseData.messages.length > 0) {
            const message_id = responseData.messages[0].id

            const { error: errorUpdateBroadcastContact } = await supabase
                .from('broadcast_contact')
                .update({ processed_at: new Date(), wam_id: message_id })
                .eq('id', contact.id)
            if (errorUpdateBroadcastContact) throw errorUpdateBroadcastContact
            const { error: errorMessageInsert } = await supabase
                .from('messages')
                .insert({
                    message: payload,
                    wam_id: message_id,
                    chat_id: Number.parseInt(responseData.contacts[0].wa_id),
                })
            if (errorMessageInsert) throw errorMessageInsert

            //TODO: Update sent_count in broadcast table
        } else {
            console.warn(`BroadcastId: ${broadcast.id} - Send message to ${contact.contact_id} - responseData.messages.length`)
        }
        console.log(`BroadcastId: ${broadcast.id} - Send message done to ${contact.contact_id}`)
        return true
    } catch(e) {
        console.error("Error whie sending message or updating status", e)
        return false
    }
}

async function sendMessages(supabase: SupabaseClientType, broadcast: Broadcast, batchId: string) {
    const { data: contacts, error } = await supabase
        .from('broadcast_contact')
        .select('*')
        .eq('batch_id', batchId)
        .is('processed_at', null)
        .order('created_at', { ascending: true })
    if (error) throw error
    console.log(`BroadcastId: ${broadcast.id} - BatchId: ${batchId} - Send batch messages started`)
    let contactsGroup = []
    for (const [idx, contact] of contacts.entries()) {
        if (contactsGroup.length < PARALLEL_SEND_MESSAGE_COUNT) {
            console.log(`sendMessages: ${contact.contact_id} appending group`)
            contactsGroup.push(contact)
        }
        if (contactsGroup.length >= PARALLEL_SEND_MESSAGE_COUNT || idx == contacts.length - 1) {
            console.log(`Sending messages parallelly to: ${contactsGroup.map(c => c.contact_id)}`)
            const contactSendPromises = []
            for (const contactToSend of contactsGroup) {
                contactSendPromises.push(sendMessageAndUpdateMessageId(supabase, broadcast, contactToSend))
            }
            const results = await Promise.all(contactSendPromises)
            const argsToUpdateCount = {
                processed_count_to_be_added: results.filter(r => r).length,
                b_id: broadcast.id
            }
            const { error: countUpdateError } = await supabase.rpc('add_processed_count_to_broadcast', argsToUpdateCount)
            if (countUpdateError) {
                console.error(`Error while updating count for broadcast: ${broadcast.id}, ${argsToUpdateCount.processed_count_to_be_added}`, countUpdateError)
            }
            contactsGroup = []
        }
    }
    console.log(`BroadcastId: ${broadcast.id} - BatchId: ${batchId} - Send batch messages completed`)
}

async function startBatch(supabase: SupabaseClientType, broadcast: Broadcast, batchId: string) {
    const { error: errorStartBatch } = await supabase
        .from('broadcast_batch')
        .update({ started_at: new Date() })
        .eq('id', batchId)
    if (errorStartBatch) throw errorStartBatch
    await sendMessages(supabase, broadcast, batchId)
    const { error: errorEndBatch } = await supabase
        .from('broadcast_batch')
        .update({ ended_at: new Date(), status: "COMPLETED" })
        .eq('id', batchId)
    if (errorEndBatch) throw errorEndBatch
}

async function startNextBatch(supabase: SupabaseClientType, broadcast: Broadcast): Promise<boolean> {
    let success = false;
    const { data: batchId, error } = await supabase.rpc('pick_next_broadcast_batch', {
        b_id: broadcast.id
    })
    if (error) throw error
    if (batchId) {
        await startBatch(supabase, broadcast, batchId)
        success = true;
    }
    console.log('batchId', batchId)
    return success;
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
    const success = await startNextBatch(supabase, messageBatchReq.broadcast)
    if (success) {
        supabase.functions.invoke('send-message-batch', {
            body: {
                broadcast: messageBatchReq.broadcast
            }
        })
    }
    return new Response(
        '{"success": true"}',
        { headers: { "Content-Type": "application/json", ...corsHeaders } },
    )
})
