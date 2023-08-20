'use client'

import { useEffect, useState } from "react";
import { DBTables } from "@/lib/enums/Tables";
import { Contact } from "../../types/contact";
import { createClient } from "../../utils/supabase-browser";
import ContactUI from "./ContactUI";

export default function ChatContactsClient({ contacts }: { contacts: Contact[] }) {
    const [supabase] = useState(() => createClient())
    const [contactsState, setContacts ] = useState<Contact[]>(contacts)
    useEffect(() => {
        const channel = supabase
            .channel('any')
            .on<Contact>('postgres_changes', { event: '*', schema: 'public', table: DBTables.Contacts }, payload => {
                switch(payload.eventType) {
                    case "INSERT":
                        contactsState.splice(0, 0, payload.new)
                        setContacts([...contactsState])
                        break;
                    case "UPDATE":
                        const indexOfItem = contactsState.findIndex((contact: Contact) => contact.wa_id == payload.old.wa_id)
                        if (indexOfItem !== -1) {
                            contactsState[indexOfItem] = payload.new
                            contactsState.sort((a: Contact, b: Contact) => {
                                if (!a.last_message_at || !b.last_message_at) {
                                    return 0;
                                }
                                const aDate = new Date(a.last_message_at)
                                const bDate =  new Date(b.last_message_at)
                                if (aDate > bDate) {
                                    return -1;
                                } else if (bDate > aDate) {
                                    return 1;
                                }
                                return 0;
                            })
                            setContacts([...contactsState])
                        } else {
                            console.warn(`Could not find contact to update contact for id: ${payload.old.wa_id}`)
                        }
                        break;
                    case "DELETE":
                        const newContacts = contactsState.filter((item: Contact) => item.wa_id != payload.old.wa_id)
                        setContacts(newContacts)
                        break;
                }
            })
            .subscribe()
        return () => { supabase.removeChannel(channel) }
    })
    return (
        <div className="flex flex-col">
            {contactsState && contactsState.map(contact => {
                return <ContactUI key={contact.wa_id} contact={contact} />
            })}
            {!contactsState && <div>No contacts to show</div>}
        </div>
    )
}
