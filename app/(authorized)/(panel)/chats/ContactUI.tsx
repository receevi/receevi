import Link from "next/link";
import { Contact } from "@/types/contact";
import BlankUser from "./BlankUser";
import { UPDATE_CURRENT_CONTACT, useContacts, useCurrentContactDispatch } from "./CurrentContactContext";
import { cn } from "@/lib/utils";

export default function ContactUI(props: { contact: Contact }) {
    const { contact } = props;
    const setCurrentContact = useCurrentContactDispatch()
    const contacts = useContacts()
    return (
        <Link href={`/chats/${contact.wa_id}`} onClick={() => { setCurrentContact && setCurrentContact({ type: UPDATE_CURRENT_CONTACT, waId: contact.wa_id }) }}>
            <div className={cn("flex flex-row p-2 hover:bg-background-default-hover gap-2 cursor-pointer", contacts && contacts.current?.wa_id === contact.wa_id ? "bg-background-default-hover": "")}>
                <div>
                    <BlankUser className="w-12 h-12" />
                </div>
                <div className="flex flex-row justify-between items-center w-full px-2">
                    <div className="flex items-center gap-">
                        <div className="flex flex-col">
                            <div>{contact.profile_name}</div>
                            <div className="text-sm">+{contact.wa_id}</div>
                        </div>
                        {/* TODO: Add some indication that this row is selected based on condition - contact.is_current */}
                    </div>
                    {(() => {
                        if (contact.unread_count && contact.unread_count > 0) {
                            return (
                                <div className="bg-green-500 flex-grow-0 flex-shrink-0 p-2 h-6 w-6 text-white rounded-full text-xs font-bold flex items-center justify-center">{contact.unread_count}</div>
                            )
                        }
                    })()}
                </div>
            </div>
        </Link>
    )
}