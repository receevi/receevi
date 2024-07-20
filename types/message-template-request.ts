
export type MediaParameter = {
    link: string
}

export type HeaderParameter = {
    type: 'text',
    text: string,
} | {
    type: 'image',
    image: MediaParameter
} | {
    type: 'video',
    video: MediaParameter
} | {
    type: 'document',
    document: MediaParameter
}

export type TextParameter = {
    type: 'text'
    text: string
}

export type PayloadParameter = {
    type: 'payload'
    payload: string
}

export type ButtonParameter = {
    type: 'url' | 'otp'
    index: number
    display_text: string
    url?: string
    value: string
}

export type RequestComponent = {
    type: 'header'
    parameters: HeaderParameter[]
} | {
    type: 'body'
    parameters: TextParameter[]
} | {
    type: 'button'
    sub_type: 'quick_reply' | 'copy_code' | 'url'
    index: string
    parameters: PayloadParameter[]
}

export type TemplateRequest = {
    name: string
    language: {
        code: string
    }
    components: RequestComponent[]
}