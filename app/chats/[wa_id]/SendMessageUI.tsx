'use client';

import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, useState } from "react";

type SendMessageUIProps = {
    onMessageSend: (message: string) => void,
    message: string,
    setMessage: Dispatch<SetStateAction<string>>
}

export default function SendMessageUI({ message, setMessage, onMessageSend }: SendMessageUIProps) {
    return (
        <form className="bg-rich-text-panel-background px-4 py-2 flex flex-row gap-4" onSubmit={(event) => {
            event.preventDefault()
            onMessageSend(message)
        }}>
            <input value={message} onChange={e => setMessage(e.target.value)} className="w-full p-2 rounded-md" placeholder="Type a message" />
            <Button type="submit">Send</Button>
        </form>
    )
}