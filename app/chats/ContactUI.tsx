import Link from "next/link";
import { Contact } from "../../types/contact";
import BlankUser from "./BlankUser";

export default function ContactUI(props: { contact: Contact }) {
    const { contact } = props;
    return (
        <Link href={`/chats/${contact.wa_id}`}>
            <div className="flex flex-row p-2 hover:bg-background-default-hover gap-4 cursor-pointer">
                <div>
                    <BlankUser />
                </div>
                <div className="flex items-center">
                    <span>{contact.wa_id} ({contact.profile.name})</span>
                </div>
            </div>
        </Link>
    )
}