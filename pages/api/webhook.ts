import type { NextApiRequest, NextApiResponse } from 'next'
import { DBCollection } from '../../enums/DBCollections'
import clientPromise from '../../lib/mongodb'
import { verifyWebhook } from '../../lib/verify'
import subscribeWebhook from '../../lib/webhook/subscribe'
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
                    field: string
                }
            ]
        }
    ]
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        await subscribeWebhook(req, res)
    } else if (req.method === "POST") {
        const xHubSigrature256 = req.headers['x-hub-signature-256'] as (string | undefined);
        const rawRequestBody = req.read().toString();
        if (!xHubSigrature256 || !verifyWebhook(rawRequestBody, xHubSigrature256)) {
            return res.status(401).send("");
        }
        const webhookBody = JSON.parse(rawRequestBody) as WebHookRequest;
        const client = await clientPromise;
        const db = client.db();
        if (webhookBody.entry.length > 0) {
            await db
                .collection(DBCollection.Entries)
                .insertMany(webhookBody.entry)
            const changes = webhookBody.entry[0].changes;
            if (changes.length > 0) {
                if (changes[0].field === "messages") {
                    const changeValue = changes[0].value;
                    const contacts = changeValue.contacts;
                    const messages = changeValue.messages;
                    if (contacts && contacts.length > 0) {
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
                    if (messages) {
                        await db
                        .collection(DBCollection.Messages)
                        .insertMany(messages)
                    }
                }
            }
        }
        res.status(200).send("");
    } else {
        res.status(400).send("");
    }
}

export const config = {
    api: {
        bodyParser: false
    }
};