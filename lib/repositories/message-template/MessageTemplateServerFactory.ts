import { MessageTemplateRepository } from "./MessageTemplateRepository";
import { MessageTemplateRepositorySupabaseImpl } from "./MessageTemplateRepositorySupabaseImpl";
import { createClient as createServerClient } from "@/utils/supabase-server";

export default class MessageTemplateServerFactory {
    private static _instance: MessageTemplateRepository;
    public static getInstance(): MessageTemplateRepository {
        if (!MessageTemplateServerFactory._instance) {
            const client = createServerClient();
            MessageTemplateServerFactory._instance = new MessageTemplateRepositorySupabaseImpl(client)
        }
        return MessageTemplateServerFactory._instance
    }
}
