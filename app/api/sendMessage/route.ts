import { NextRequest, NextResponse } from "next/server";
import { DBTables } from "@/lib/enums/Tables";
import { createServiceClient } from "@/lib/supabase/service-client";

async function sendWhatsAppMessage(to: string, message: string) {
    const WHATSAPP_API_URL = `https://graph.facebook.com/v13.0/${process.env.WHATSAPP_API_PHONE_NUMBER_ID}/messages`;
    const payload = {
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: {
            "preview_url": false,
            "body": message
        }
    };
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`
    };
    const res = await fetch(WHATSAPP_API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
    });
    if (!res.ok) {
        const responseStatus = await res.status
        const response = await res.text()
        throw new Error(responseStatus + response);
    }
    const msgToPut: any = structuredClone(payload)
    delete msgToPut.messaging_product;
    const response = await res.json()
    const wamId = response.messages[0].id;
    msgToPut['id'] = wamId
    const supabase = createServiceClient()
    const supabaseResponse = await supabase
        .from(DBTables.Messages)
        .insert({
            message: msgToPut,
            wam_id: wamId,
            chat_id: Number.parseInt(response.contacts[0].wa_id),
        })
    console.log(supabaseResponse)
}

export async function POST(request: NextRequest) {
    const requestBody = await request.json()
    console.log('requestBody', requestBody)
    await sendWhatsAppMessage(requestBody.to, requestBody.message)
    return new NextResponse()
}
