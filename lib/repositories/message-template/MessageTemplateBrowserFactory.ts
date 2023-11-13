import { MessageTemplateRepository } from "./MessageTemplateRepository";
import { MessageTemplateRepositorySupabaseImpl } from "./MessageTemplateRepositorySupabaseImpl";
import { createClient as createBrowserClient } from "@/utils/supabase-browser";

export default class MessageTemplateBrowserFactory {
    private static _instance: MessageTemplateRepository;
    public static getInstance(): MessageTemplateRepository {
        if (!MessageTemplateBrowserFactory._instance) {
            const client = createBrowserClient();
            MessageTemplateBrowserFactory._instance = new MessageTemplateRepositorySupabaseImpl(client)
        }
        return MessageTemplateBrowserFactory._instance
    }
}
