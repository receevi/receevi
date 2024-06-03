import { MessageTemplateResponse } from "../setup/message_template.ts";

export async function getMessageTemplate(name: string, language: string) {
    const whatsappBusinessAccountId = Deno.env.get('WHATSAPP_BUSINESS_ACCOUNT_ID')
    if (!whatsappBusinessAccountId) throw new Error("WHATSAPP_BUSINESS_ACCOUNT_ID environment variable is not set")
    const token = Deno.env.get('WHATSAPP_ACCESS_TOKEN')
    const url = `https://graph.facebook.com/v17.0/${whatsappBusinessAccountId}/message_templates`;
    const params = new URLSearchParams();
    params.set('name', name);
    params.set('language', language);
    const response = await fetch(url + '?' + params, {
        headers: {
            'authorization': `Bearer ${token}`
        }
    })
    const jsonResponse: MessageTemplateResponse = await response.json()
    if (jsonResponse.data.length > 0) {
        const messageTemplate = jsonResponse.data[0]
        return messageTemplate;
    }
    return null;
}