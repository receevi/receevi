import { DBCollection } from "../../enums/DBCollections";
import clientPromise from "../../lib/mongodb";
import { Contact } from "../../types/contact";
import ContactUI from "./ContactUI";

// hack to bypass typescript (temporarily)
function asyncComponent<T, R>(fn: (arg: T) => Promise<R>): (arg: T) => R {
    return fn as (arg: T) => R;
}

const ChatContacts = asyncComponent(async () => {
    const client = await clientPromise;
    const db = client.db();
    const contacts = await db
        .collection<Contact>(DBCollection.Contacts)
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
})

export default ChatContacts;