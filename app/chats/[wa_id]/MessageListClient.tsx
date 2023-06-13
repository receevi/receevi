'use client'

import { useEffect, useRef, useState } from "react"
import { DBTables } from "../../../enums/Tables"
import { MessageJson, TextMessage } from "../../../types/Message"
import { createClient } from "../../../utils/supabase-browser"
import ReceivedImageMessageUI from "./ReceivedImageMessageUI"
import ReceivedTextMessageUI from "./ReceivedTextMessageUI"
import TailWrapper from "./TailWrapper"

export default function MessageListClient({ messages, from }: { messages: DBMessage[], from: string }) {
    const [supabase] = useState(() => createClient())
    const [stateMessages, setMessages] = useState<DBMessage[]>(messages)
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }
    useEffect(() => {
        scrollToBottom()
        const channel = supabase
            .channel('any')
            .on<DBMessage>('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: DBTables.Messages,
                filter: `chat_id=eq.${from}`
            }, payload => {
                setMessages([...stateMessages, payload.new])
                scrollToBottom()
            })
            .subscribe()
        return () => { supabase.removeChannel(channel) }
    })
    return (
        <div className="px-16 py-2 h-full overflow-y-auto" ref={messagesEndRef}>
            {stateMessages.map((message, index) => {
                const messageBody = message.message as MessageJson
                return (
                    <div className="my-1" key={message.id}>
                        <TailWrapper showTail={index === 0 ? true : stateMessages[index].message.from !== stateMessages[index - 1].message.from} isSent={!!messageBody.to}>
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
                        </TailWrapper>
                    </div>
                )
            })}
        </div>
    )
}
