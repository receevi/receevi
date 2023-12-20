export type WebhookImage = {
    id: string,
    sha256: string,
    mime_type: string,
}

export type WebhookMessage = {
    from: string,
    id: string,
    timestamp: string,
    image?: WebhookImage,
    type: 'text' | 'reaction' | 'image',
}

export type WebhookStatus = {
    id: string,
    status: 'read' | 'sent' | 'delivered',
    timestamp: string,
    recipient_id: string,
    pricing?: {
        billable: boolean,
        category: string,
        pricing_model: string,
    },
    conversation?: {
        id: string,
        origin: {
            type: string,
        },
        expiration_timestamp?: string,
    },
}

export type WebHookRequest = {
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
                        messages: WebhookMessage[],
                        statuses: WebhookStatus[],
                    },
                    field: string
                }
            ]
        }
    ]
}
