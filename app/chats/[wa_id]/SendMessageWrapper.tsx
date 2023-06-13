'use client';

import { useState } from "react";
import SendMessageUI from "./SendMessageUI";

export default function SendMessageWrapper({ waId }: { waId: string }) {
    const [message, setMessage] = useState<string>('');
    const onMessageSend = async (message: string) => {
        const headers = new Headers();

        headers.append('Content-Type', 'application/json');
        const response = await fetch('/api/sendMessage', {
            method: 'POST',
            body: JSON.stringify({ to: waId, message: message }),
            headers: headers
        })
        if (response.status === 200) {
            setMessage('')
        } else {
            throw new Error(`Request failed with status code ${response.status}`);
        }
    }

    return (
        <SendMessageUI message={message} setMessage={setMessage} onMessageSend={onMessageSend} />
    )
}