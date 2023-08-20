import { DBTables } from "@/lib/enums/Tables";
import { createClient } from "../../../utils/supabase-server";
import ChatHeader from "./ChatHeader";
import MessageListClient from "./MessageListClient";
import SendMessageWrapper from "./SendMessageWrapper";

export const revalidate = 0

export default async function ContactChat({ params }: { params: { wa_id: string } }) {
    const supabase = await createClient();
    const { data: messages, error } = await supabase
        .from(DBTables.Messages)
        .select('*')
        .eq('chat_id', params.wa_id)
        .order('created_at', { ascending: true })
    if (error) throw error
    return (
        <div className="bg-conversation-panel-background h-full relative">
            <div className="bg-chat-img h-full w-full absolute bg-[length:412.5px_749.25px] opacity-40"></div>
            <div className="h-full relative flex flex-col">
                <ChatHeader waId={params.wa_id} />
                {
                    (() => {
                        if (messages != null) {
                            return <MessageListClient from={params.wa_id} messages={messages} />
                        }
                    })()
                }
                <SendMessageWrapper waId={params.wa_id} />
            </div>
        </div>
    )
}