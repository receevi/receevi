type Contact = {
    input: string;
    wa_id: string;
};

type Message = {
    id: string;
    message_status: string;
};

type SendMessageResponse = {
    messaging_product: 'whatsapp';
    contacts: Contact[];
    messages: Message[];
};


export async function sendTemplateMessage(templateName: string, language: string, contact_id: string) {
    const payload = {
        "messaging_product": "whatsapp",
        "to": contact_id,
        "type": "template",
        "template": {
            "name": templateName,
            "language": {
                "code": language
            },
        }
    }
    const WHATSAPP_ACCESS_TOKEN = Deno.env.get('WHATSAPP_ACCESS_TOKEN')
    if (!WHATSAPP_ACCESS_TOKEN) {
        throw new Error("environment variable WHATSAPP_ACCESS_TOKEN not found")
    }
    const WHATSAPP_API_PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_API_PHONE_NUMBER_ID')
    if (!WHATSAPP_API_PHONE_NUMBER_ID) {
        throw new Error("environment variable WHATSAPP_API_PHONE_NUMBER_ID not found")
    }
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`
    }
    const url = `https://graph.facebook.com/v13.0/${WHATSAPP_API_PHONE_NUMBER_ID}/messages`
    const res = await fetch(url, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify(payload)
    })
    if (!res.ok) {
        const responseStatus = await res.status
        const response = await res.text()
        throw new Error(responseStatus + response);
    }
    const responseData: SendMessageResponse = await res.json()
    return { payload, response: responseData };
}

export async function sendTemplateMessageDummy(templateName: string, language: string, contact_id: string) {
    console.log(`sendTemplateMessageDummy: templateName: ${templateName}, language: ${language}, contact_id: ${contact_id}`)
    const payload = {
        "messaging_product": "whatsapp",
        "to": contact_id,
        "type": "template",
        "template": {
            "name": templateName,
            "language": {
                "code": language
            },
        }
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
    const response: SendMessageResponse = {
        messaging_product: 'whatsapp',
        contacts: [
            {
                wa_id: contact_id,
                input: 'whatsapp'
            }
        ],
        messages: [
            {
                "id": crypto.randomUUID(),
                "message_status": "accepted"
            }
        ]
    }
    return { payload, response }
}
