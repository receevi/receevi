import type { NextApiRequest, NextApiResponse } from 'next'
import { DBCollection } from '../../enums/DBCollections'
import clientPromise from '../../lib/mongodb'
import { verifyWebhook } from '../../lib/verify'
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
    res.status(200).send("");
}

export const config = {
    api: {
        bodyParser: false
    }
};