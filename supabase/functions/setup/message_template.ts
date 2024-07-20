import { SetupCore } from "./setup_core.ts";
import { SupabaseClientType } from "../_shared/supabase_types.ts";
import { syncMessageTemplates } from "../sync-message-templates/utils.ts";

export type Button = {
    type: string;
    text: string;
    url: string;
    example: string[];
};

export type Component = {
    type: "HEADER" | "BODY" | "BUTTONS";
    format?: "TEXT";
    text: string;
    example?: {
        header_text?: string[];
        body_text?: string[][];
    };
    buttons?: Button[];
};

export type Template = {
    name: string;
    components: Component[];
    language: string;
    status: string;
    category: string;
    previous_category: string;
    id: string;
};

export type Cursors = {
    before: string;
    after: string;
};

export type Paging = {
    cursors: Cursors;
    next: string;
};

export type MessageTemplateResponse = {
    data: Template[];
    paging: Paging;
};


export class MessageTemplateSetup extends SetupCore {
    constructor(supabase: SupabaseClientType) {
        super(supabase, 'download_message_templates')
    }

    async setup(supabase: SupabaseClientType): Promise<void> {
        await syncMessageTemplates(supabase)
    }
}
