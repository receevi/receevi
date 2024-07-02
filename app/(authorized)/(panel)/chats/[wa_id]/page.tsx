'use client'

import { DBTables } from "@/lib/enums/Tables";
import ChatHeader from "./ChatHeader";
import MessageListClient from "./MessageListClient";
import SendMessageWrapper from "./SendMessageWrapper";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase-browser";
import ContactBrowserFactory from "@/lib/repositories/contacts/ContactBrowserFactory";
import { Contact } from "@/types/contact";
import { Button } from "@/components/ui/button";

export const revalidate = 0

export default function ContactChat({ params }: { params: { wa_id: string } }) {
    const [isChatWindowOpen, setChatWindowOpen] = useState<boolean | undefined>()
    const [lastMessageReceivedAt, setLastMessageReceivedAt] = useState<Date | undefined>()
    const [ contactRepository ] = useState(() => ContactBrowserFactory.getInstance())
    const [ supabase ] = useState(() => createClient())
    useEffect(() => {
        contactRepository.getContactById(params.wa_id).then((contact) => {
            setLastMessageReceivedAt(contact.last_message_received_at ? new Date(contact.last_message_received_at) : undefined)
        })
    }, [contactRepository, setChatWindowOpen, params.wa_id, setLastMessageReceivedAt])

    useEffect(() => {
        if (lastMessageReceivedAt) {
            const minute = 1000 * 60;
            const hour = minute * 60;
            const day = hour * 24;
            const messageCreationTime = lastMessageReceivedAt.getTime()
            const currentTime = (new Date()).getTime()
            const isChatWindowOpen = (currentTime - messageCreationTime) < day
            setChatWindowOpen(isChatWindowOpen)
        } else {
            setChatWindowOpen(false)
        }
    }, [lastMessageReceivedAt, setChatWindowOpen])

    useEffect(() => {
        console.log('params.wa_id', params.wa_id)
        const channel = supabase
            .channel('last-message-received-channel')
            .on<Contact>('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'contacts',
                filter: `wa_id=eq.${params.wa_id}`
            }, payload => {
                if (payload.new.last_message_received_at) {
                    setLastMessageReceivedAt(new Date(payload.new.last_message_received_at))
                }
            })
            .subscribe()
        return () => { supabase.removeChannel(channel) }
    }, [supabase, params.wa_id])

    return (
        <div className="bg-conversation-panel-background h-full relative">
            <div className="bg-chat-img h-full w-full absolute bg-[length:412.5px_749.25px] opacity-40"></div>
            <div className="h-full relative flex flex-col">
                <ChatHeader waId={params.wa_id} />
                <MessageListClient from={params.wa_id} />
                {(() => {
                    if (typeof isChatWindowOpen != 'undefined') {
                        if (isChatWindowOpen) {
                            return <SendMessageWrapper waId={params.wa_id} />
                        } else {
                            return (
                                <div className="p-4 bg-white flex flex-row gap-4">
                                    <span>You can only send a message within 24 hours of the last customer interaction. Please wait until the customer reaches out to you again or send a template message.</span>
                                    <Button className="min-w-fit">Send template message</Button>
                                </div>
                            )
                        }
                    }
                    return <></>
                })()}
            </div>
        </div>
    )
}