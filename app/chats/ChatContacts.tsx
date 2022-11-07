import { DBCollection } from "../../enums/DBCollections";
import clientPromise from "../../lib/mongodb";
import { Contact } from "../../types/contact";
import ContactUI from "./ContactUI";

export default async function ChatContacts() {
    const client = await clientPromise;
    const db = client.db();
    const contacts: Contact[] = await db
        .collection(DBCollection.Contacts)
        .find({})
        .sort({ last_msg_received: -1 })
        .toArray();
    return (
        <div className="flex flex-col">
            {contacts.map(contact => {
                return <ContactUI key={contact.wa_id} contact={contact} />
            })}
        </div>
    )
}