'use client'

import { useEffect, useState } from "react"
import { DBTables } from "../../../enums/Tables"
import { MessageJson, TextMessage } from "../../../types/Message"
import { createClient } from "../../../utils/supabase-browser"
import ReceivedImageMessageUI from "./ReceivedImageMessageUI"
import ReceivedTextMessageUI from "./ReceivedTextMessageUI"

export default function MessageListClient({ messages, from }: { messages: DBMessage[], from: string }) {
    const [supabase] = useState(() => createClient())
    const [stateMessages, setMessages ] = useState<DBMessage[]>(messages)
    useEffect(() => {
        const channel = supabase
            .channel('any')
            .on<DBMessage>('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: DBTables.Messages,
                filter: `from=eq.${from}`
            }, payload => {
                setMessages([...stateMessages, payload.new])
            })
            .subscribe()
        return () => { supabase.removeChannel(channel) }
    })
    return (
        <div className="px-16 py-2">
            {stateMessages.map((message) => {
                const messageBody = message.message as MessageJson
                return (
                    <div className="my-2" key={message.id}>
                        {
                            (() => {
                                switch (messageBody.type) {
                                    case "text":
                                        return <ReceivedTextMessageUI textMessage={messageBody as TextMessage} />
                                    case "image":
                                        return <ReceivedImageMessageUI message={message} />
                                    default:
                                        return <div>Unsupported message</div>
                                }
                            })()
                        }
                    </div>
                )
            })}
        </div>
    )
}
