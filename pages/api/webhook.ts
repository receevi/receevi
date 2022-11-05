import type { NextApiRequest, NextApiResponse } from 'next'
import { DBCollection } from '../../enums/DBCollections'
import clientPromise from '../../lib/mongodb'
import { Contact } from '../../types/contact'
import { Message } from '../../types/Message'

type WebHookRequest = {
    object: "whatsapp_business_account",
    entry: [
        {
            id: string,
            changes: [
                {
                    value: {
                        metadata: {
                            display_phone_number: string,
                            phone_number_id: string,
                        }
                        contacts: Contact[],
                        messages: Message[],
                    },
                    field: "messages"
                }
            ]
        }
    ]
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const client = await clientPromise;
    const db = client.db();
    const webhookBody = req.body as WebHookRequest;
    if (webhookBody.entry.length > 0) {
        const changes = webhookBody.entry[0].changes;
        if (changes.length > 0) {
            const changeValue = changes[0].value;
            const contacts = changeValue.contacts;
            const messages = changeValue.messages;
            if (contacts.length > 0) {
                for (const contact of contacts) {
                    contact.last_msg_received = new Date().valueOf();
                    await db
                        .collection(DBCollection.Contacts)
                        .updateOne(
                            { wa_id: contact.wa_id },
                            { $set: contact },
                            { upsert: true }
                        );
                }
            }
            await db
                .collection("messages")
                .insertMany(messages)
        }
    }
    res.status(200).json({});
}
