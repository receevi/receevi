import { SupabaseClientType } from "../_shared/supabase_types.ts";
import { MessageTemplateResponse } from "../setup/message_template.ts";

export async function syncMessageTemplates(supabase: SupabaseClientType) {
    const whatsappBusinessAccountId = Deno.env.get('WHATSAPP_BUSINESS_ACCOUNT_ID')
    if (!whatsappBusinessAccountId) throw new Error("WHATSAPP_BUSINESS_ACCOUNT_ID environment variable is not set")

    const token = Deno.env.get('WHATSAPP_ACCESS_TOKEN')
    const fetchLimit = 10
    let next = `https://graph.facebook.com/v17.0/${whatsappBusinessAccountId}/message_templates?limit=${fetchLimit}`;
    while (next) {
        console.log(`Fetch url: ${next}`)
        const response = await fetch(next, {
            headers: {
                'authorization': `Bearer ${token}`
            }
        })
        const jsonResponse: MessageTemplateResponse = await response.json()
        const databaseInput = jsonResponse.data.map((remoteData) => {
            const { id, name, category, previous_category, status, language, components, ...rest } = remoteData
            const restOfTheKeys = Object.keys(rest)
            if (restOfTheKeys.length > 0) {
                console.warn("There are new columns from facebook console", Object.keys(rest))
            }
            return {
                id: id,
                name: name,
                category: category,
                previous_category: previous_category,
                status: status,
                language: language,
                components: components,
                updated_at: new Date(),
            }
        })
        const { error } = await supabase
            .from('message_template')
            .upsert(databaseInput)
        if (error) throw error
        next = jsonResponse.paging.next
    }
}