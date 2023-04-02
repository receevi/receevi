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
                    },
                    field: string
                }
            ]
        }
    ]
}
