'use server';

import { createClient } from "@/utils/supabase-server";

async function markAsRead({messageIds, chatId}: { messageIds: number[], chatId: string}) {
    const supabase = createClient()
    const chunkSize = 100;
    for (let i = 0; i < messageIds.length; i += chunkSize) {
        const chunk = messageIds.slice(i, i + chunkSize);
        const { error } = await supabase.from('messages').update({ read_by_user_at: new Date() }).in('id', chunk)
        console.log('error', error)
    }
    await supabase.functions.invoke('update-unread-count', { body: {
        chat_id: [chatId]
    }})
}

export { markAsRead }
