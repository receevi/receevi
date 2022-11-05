import clientPromise from "../../lib/mongodb";
import { Contact } from "../../types/contact";
import ContactUI from "./ContactUI";

export default async function ChatContacts() {
    const client = await clientPromise;
    const db = client.db("wawebhook");
    const contacts: Contact[] = await db
        .collection("contacts")
        .find({})
        .sort({ last_msg_received: -1 })
        .toArray();
    return (
        <div className="flex flex-col">
            {contacts.map(contact => {
                return <ContactUI contact={contact} />
            })}
        </div>
    )
}