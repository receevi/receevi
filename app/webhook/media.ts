import { DBTables } from "@/lib/enums/Tables";
import { httpsGet } from "@/lib/httpsGet";
import { createServiceClient } from "@/lib/supabase/service-client";
import { MediaResponse } from "../../types/MediaResponse";
import { WebhookMessage } from "../../types/webhook";

const fileExtRegex = /filename=File.([A-z0-9]+)$/

function getFileExtensionFromContentDisposition(contentDisposition: string) {
    const regexResult = fileExtRegex.exec(contentDisposition)
    if (regexResult) {
        return regexResult[1]
    }
    console.log(`${contentDisposition} could not be parsed`)
    return null
}

export async function downloadMedia(imageMessage: WebhookMessage) {
    const imageDetails = imageMessage.image
    if (!imageDetails) {
        throw new Error("image details not available in image key")
    }
    const headerOptions = {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'User-Agent': 'curl/7.84.0',
        'Accept': '*/*',
    }
    const firstResponse: Response = await fetch(`https://graph.facebook.com/v15.0/${imageDetails.id}`, { headers: headerOptions })

    if (!firstResponse.ok) {
        const responseText = await firstResponse.text()
        throw new Error(`First response error - status: ${firstResponse.status}, response: ${responseText}`)
    }

    const firstResponseBody: MediaResponse = await firstResponse.json()

    const mediaResponse = await httpsGet(firstResponseBody.url, { headers: headerOptions })  // because fetch is not working :(

    if (!mediaResponse.statusCode || mediaResponse.statusCode >= 400) {
        throw new Error(`Media response error - status: ${mediaResponse.statusCode}`)
    }

    const mediaBody = mediaResponse.body
    if (mediaBody) {
        const contentDisposition = mediaResponse.headers["content-disposition"]
        let extension;
        if (contentDisposition) {
            extension = getFileExtensionFromContentDisposition(contentDisposition)
        }
        if (!extension) {
            extension = 'unknown'
        }
        const supabase = createServiceClient()
        const { data, error } = await supabase
            .storage
            .from('media')
            .upload(`${imageMessage.from}/${imageDetails.id}.${extension}`, mediaBody, {
                cacheControl: '3600',
                contentType: mediaResponse.headers['content-type'],
                upsert: false,
                duplex: 'half',
            })
        if (error) throw error
        console.log(`media stored at ${data.path}`)
        const updateResult = await supabase
            .from(DBTables.Messages)
            .update({ media_url: data.path })
            .eq('wam_id', imageMessage.id)
        if (updateResult.error) throw updateResult.error
    } else {
        console.warn('mediaBody is null')
    }
}
