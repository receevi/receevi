import { NextApiRequest, NextApiResponse } from "next";
import { WritableStream } from "stream/web";
import { httpsGet } from "@/lib/httpsGet";
import { getUserDataFromRequest } from "@/lib/userdata";
import { MediaResponse } from "../../types/MediaResponse";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const userData = await getUserDataFromRequest(req);
    const mediaId = req.query?.mediaId
    if (!userData || !mediaId) {
        return res.status(401).send("")
    }
    const headerOptions = {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'User-Agent': 'curl/7.84.0',
        'Accept': '*/*',
    }

    const response: Response = await fetch(`https://graph.facebook.com/v15.0/${mediaId}`, { headers: headerOptions })
    const mediaResponse: MediaResponse = await response.json()

    const media = await httpsGet(mediaResponse.url, { headers: headerOptions })  // because fetch is not working :(
    const mediaBody = await media.body

    res.writeHead(200, {
        'Content-Type': mediaResponse.mime_type,
        'Content-Length': mediaResponse.file_size
    });

    const stream = new WritableStream({
        write(chunk) {
            res.write(chunk)
        }
    });
    await mediaBody?.pipeTo(stream)
    res.end()
}
