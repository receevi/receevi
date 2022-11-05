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
