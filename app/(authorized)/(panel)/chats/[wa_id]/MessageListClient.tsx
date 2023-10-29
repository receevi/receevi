'use client'

import { useEffect, useRef, useState } from "react"
import { DBTables } from "@/lib/enums/Tables"
import { MessageJson, TextMessage } from "@/types/Message"
import { createClient } from "@/utils/supabase-browser"
import ReceivedImageMessageUI from "./ReceivedImageMessageUI"
import ReceivedTextMessageUI from "./ReceivedTextMessageUI"
import TailWrapper from "./TailWrapper"

type UIMessageModel = DBMessage & {
    msgDate: string
}

function addDateToMessages(withoutDateArray: DBMessage[]): UIMessageModel[] {
    return withoutDateArray.map((messageWithoutDate) => {
        let withDate: UIMessageModel = {
            ...messageWithoutDate,
            msgDate: new Date(messageWithoutDate.created_at).toLocaleDateString()
        }
        return withDate;
    })
}

export default function MessageListClient({ messages, from }: { messages: DBMessage[], from: string }) {
    const [supabase] = useState(() => createClient())
    const [stateMessages, setMessages] = useState<UIMessageModel[]>(addDateToMessages(messages))
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
                setMessages([...stateMessages, ...addDateToMessages([payload.new])])
                scrollToBottom()
            })
            .subscribe()
        return () => { supabase.removeChannel(channel) }
    })
    return (
        <div className="px-16 py-2 h-full overflow-y-auto" ref={messagesEndRef}>
            {stateMessages.map((message, index) => {
                const messageBody = message.message as MessageJson
                const messageDateTime = new Date(message.created_at)
                return (
                    <div key={message.id}>
                        {
                            (() => {
                                if (index === 0 ? true : message.msgDate !== stateMessages[index - 1].msgDate) {
                                    return (
                                        <div className="flex justify-center ">
                                            <span className="p-2 rounded-md bg-system-message-background text-system-message-text text-sm">{message.msgDate}</span>
                                        </div>
                                    )
                                }
                            })()
                        }
                        <div className="my-1" >
                            <TailWrapper showTail={index === 0 ? true : stateMessages[index].message.from !== stateMessages[index - 1].message.from} isSent={!!messageBody.to}>
                                <div className="px-2 pt-2 flex flex-col items-end gap-1 relative">
                                    <div className="pb-2 inline-block">
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
                                        <span className="invisible">ww:ww wm</span>
                                    </div>
                                    <span className="text-xs pb-2 pe-2 text-bubble-meta absolute bottom-0 end-0">{messageDateTime.toLocaleTimeString().toLowerCase()}</span>
                                </div>
                            </TailWrapper>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
