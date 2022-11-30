export type Message = {
    from: string,
    id: string,
    timestamp: string,
    type: string,
}

export type TextMessageBody = {
    body: string,
}

export type TextMessage = Message & {
    text: TextMessageBody
}

export type ImageMessageBody = {
    mime_type: string,
    sha256: string,
    id: string,
}

export type ImageMessage = Message & {
    image: ImageMessageBody,
}
