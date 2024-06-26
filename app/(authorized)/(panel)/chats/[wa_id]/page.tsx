'use client'

import { DBTables } from "@/lib/enums/Tables";
import { createClient } from "@/utils/supabase-server";
import ChatHeader from "./ChatHeader";
import MessageListClient from "./MessageListClient";
import SendMessageWrapper from "./SendMessageWrapper";
import { useState } from "react";

export const revalidate = 0

export default function ContactChat({ params }: { params: { wa_id: string } }) {
    const [isChatWindowOpen, setChatWindowOpen] = useState<boolean | undefined>()
    return (
        <div className="bg-conversation-panel-background h-full relative">
            <div className="bg-chat-img h-full w-full absolute bg-[length:412.5px_749.25px] opacity-40"></div>
            <div className="h-full relative flex flex-col">
                <ChatHeader waId={params.wa_id} />
                <MessageListClient from={params.wa_id} setChatWindowOpen={setChatWindowOpen} />
                {(() => {
                    if (typeof isChatWindowOpen != 'undefined') {
                        if (isChatWindowOpen) {
                            return <SendMessageWrapper waId={params.wa_id} />
                        } else {
                            return <div>Chat window is passed</div>
                        }
                    }
                    return <></>
                })()}
            </div>
        </div>
    )
}