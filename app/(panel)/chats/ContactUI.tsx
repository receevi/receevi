import Link from "next/link";
import { Contact } from "../../../types/contact";
import BlankUser from "./BlankUser";
import { UPDATE_CURRENT_CONTACT, useCurrentContactDispatch } from "./CurrentContactContext";

export default function ContactUI(props: { contact: Contact }) {
    const { contact } = props;
    const setCurrentContact = useCurrentContactDispatch()
    return (
        <Link href={`/chats/${contact.wa_id}`} onClick={() => { setCurrentContact && setCurrentContact({ type: UPDATE_CURRENT_CONTACT, waId: contact.wa_id }) }}>
            <div className="flex flex-row p-2 hover:bg-background-default-hover gap-4 cursor-pointer">
                <div>
                    <BlankUser className="w-12 h-12" />
                </div>
                <div className="flex items-center">
                    <span>{contact.wa_id} ({contact.profile_name})</span>
                    {/* TODO: Add some indication that this row is selected based on condition - contact.is_current */}
                </div>
            </div>
        </Link>
    )
}