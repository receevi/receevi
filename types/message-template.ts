export type MessageTemplateResponse = {
    data: MessageTemplate[];
    paging: WhatsappPaging
}

export type WhatsappPaging = {
    cursors: {
        before: string;
        after: string;
    }
}

export type MessageTemplate = {
    name: string;
    previous_category?: string | null;
    components: MessageTemplateComponent[];
    language: string;
    status: string;
    category: string;
    id: string;
};

export type MessageTemplateComponent =
    | MessageTemplateHeader
    | MessageTemplateBody
    | MessageTemplateFooter
    | MessageTemplateButtons;

export type MessageTemplateHeader = {
    type: "HEADER";
    format: "TEXT" | "DOCUMENT" | "IMAGE" | "VIDEO";
    text: string;
    example?: {
        header_text: string[];
    };
};

export type MessageTemplateBody = {
    type: "BODY";
    text: string;
    example?: {
        body_text: string[][];
    };
};

export type MessageTemplateFooter = {
    type: "FOOTER";
    text: string;
};

export type MessageTemplateButtons = {
    type: "BUTTONS";
    buttons: MessageTemplateButton[];
};

export type MessageTemplateButton = {
    type: "URL" | "QUICK_REPLY";
    text: string;
    url?: string;
    example?: string[];
};
