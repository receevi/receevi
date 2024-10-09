'use client'

import { DBTables } from "@/lib/enums/Tables";
import { Contact } from "@/types/contact";
import { createClient } from "@/utils/supabase-browser";
import { useEffect, useState } from "react";
import ContactUI from "./ContactUI";

function sortContacts(contacts: Contact[]) {
    contacts.sort((a: Contact, b: Contact) => {
        if (!a.last_message_at || !b.last_message_at) {
            return 0;
        }
        const aDate = new Date(a.last_message_at)
        const bDate = new Date(b.last_message_at)
        if (aDate > bDate) {
            return -1;
        } else if (bDate > aDate) {
            return 1;
        }
        return 0;
    })
}

export default function ChatContactsClient({ contacts }: { contacts: Contact[] }) {
    const [supabase] = useState(() => createClient())
    const [contactsState, setContacts] = useState<Contact[]>(contacts)
    useEffect(() => {
        const channel = supabase.channel('chat-contacts')
            .on<Contact>('postgres_changes', { event: '*', schema: 'public', table: DBTables.Contacts }, payload => {
                switch (payload.eventType) {
                    case "INSERT":
                        setContacts(contactsState => {
                            contactsState.splice(0, 0, payload.new)
                            return [...contactsState]
                        })
                        break;
                    case "UPDATE":
                        setContacts(contactsState => {
                            const indexOfItem = contactsState.findIndex((contact: Contact) => contact.wa_id == payload.old.wa_id)
                            if (indexOfItem !== -1) {
                                contactsState[indexOfItem] = payload.new
                            } else {
                                console.warn(`Could not find contact to update contact for id: ${payload.old.wa_id}`)
                                contactsState.splice(0, 0, payload.new)
                            }
                            sortContacts(contactsState)
                            return [...contactsState]
                        })
                        break;
                    case "DELETE":
                        setContacts(contactsState => {
                            const newContacts = contactsState.filter((item: Contact) => item.wa_id != payload.old.wa_id)
                            return [...newContacts];
                        })
                        break;
                }
            })
            .subscribe()
        return () => { supabase.removeChannel(channel) };
    }, [supabase, setContacts])

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] overflow-y-auto">
            {contactsState && contactsState.map(contact => {
                return <ContactUI key={contact.wa_id} contact={contact} />
            })}
            {!contactsState && <div>No contacts to show</div>}
        </div>
    )
}
