'use client'

import ChatContactsClient from "./ChatContactsClient";
import { useContacts } from "./CurrentContactContext";

export const revalidate = 0

export default function ChatContacts() {
    const contactState = useContacts();
    if (contactState) {
        return (
            <div className="flex flex-col">
                <ChatContactsClient contacts={contactState.contacts} />
            </div>
        )
    } else {
        return (
            <div>
                Unable to fetch contacts
            </div>
        )
    }
}
