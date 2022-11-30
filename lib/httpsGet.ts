import { IncomingMessage } from "http";
import { get, RequestOptions } from "https";

export type WWCustomResponse = IncomingMessage & {
    body: ReadableStream<Uint8Array> | null;
}

export function httpsGet(url: string | URL,
    options: RequestOptions): Promise<WWCustomResponse> {
    return new Promise<WWCustomResponse>((resolve, reject) => {
        get(url, options, (res) => {
            const newRes = res as WWCustomResponse
            newRes.body = new ReadableStream({
                start(controller) {
                    res.on('data', (chunk) => {
                        controller.enqueue(chunk)
                    })
                    res.on('end', () => {
                        controller.close()
                    })
                }
            })
            resolve(newRes)
        }).on('error', (e) => { reject(e) })
    })
}