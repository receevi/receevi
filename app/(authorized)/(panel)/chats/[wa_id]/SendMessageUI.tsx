'use client';

import TWLoader from "@/components/TWLoader";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, useState } from "react";

type SendMessageUIProps = {
    onMessageSend: (message: string) => void,
    message: string,
    setMessage: Dispatch<SetStateAction<string>>
}

export default function SendMessageUI({ message, setMessage, onMessageSend }: SendMessageUIProps) {
    const [messageSendInProgress, setMessageSendInProgress] = useState<boolean>(false);
    return (
        <form className="bg-rich-text-panel-background px-4 py-2 flex flex-row gap-4" onSubmit={async (event) => {
            event.preventDefault()
            if (message.trim().length > 0) {
                setMessageSendInProgress(true)
                try {
                    await onMessageSend(message)
                } finally {
                    setMessageSendInProgress(false)
                }
            }
        }}>
            <input value={message} onChange={e => setMessage(e.target.value)} className="w-full p-2 rounded-md" placeholder="Type a message" />
            <Button type="submit" className="w-32" disabled={messageSendInProgress}>{messageSendInProgress ? <TWLoader className="w-4 h-4"/> : 'Send'}</Button>
        </form>
    )
}