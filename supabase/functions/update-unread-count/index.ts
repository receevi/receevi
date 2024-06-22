import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createSupabaseClient } from "../_shared/client.ts";

serve(async (req) => {
    const authorizationHeader = req.headers.get('Authorization')!
    const supabase = createSupabaseClient(authorizationHeader)

    const reqData = await req.json()
    const chatIds = reqData.chat_id
    for (const chatId of chatIds) {
        console.log('chatId', chatId)
        const { count, error } = await supabase
            .from('messages')
            .select('*', { count:'exact', head: true })
            .is('read_by_user_at', null)
            .eq('chat_id', chatId)
            .eq('is_received', true)
        if (error) {
            console.error("Error while fetching unread messasge count", error)
            continue
        }
        const { error: updateError } = await supabase.from('contacts').update({ unread_count: count }).eq('wa_id', chatId)
        if (updateError) console.error("Error while updating unread messasge count", updateError)
    }

    return new Response(
        '{"success": true"}',
    )
})
