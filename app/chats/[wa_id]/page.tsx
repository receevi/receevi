import { DBTables } from "../../../enums/Tables";
import { createClient } from "../../../utils/supabase-server";
import MessageListClient from "./MessageListClient";

export const revalidate = 0

export default async function ContactChat({ params }: { params: { wa_id: string } }) {
    const supabase = await createClient();
    const { data: messages, error } = await supabase
        .from(DBTables.Messages)
        .select('*')
        .eq('from', params.wa_id)
    if (error) throw error
    return (
        <div className="bg-conversation-panel-background h-full">
            <div className="bg-chat-img h-full">
                {
                    (() => {
                        if (messages != null) {
                            return <MessageListClient messages={messages} />
                        }
                    })()
                }
            </div>
        </div>
    )
}