import { createClient as createBrowserClient } from "@/utils/supabase-browser";
import { MessageTemplateRepository } from "./MessageTemplateRepository";

type SupabaseClientType = ReturnType<typeof createBrowserClient>

export class MessageTemplateRepositorySupabaseImpl implements MessageTemplateRepository {
    private client;
    constructor(client: SupabaseClientType) {
        this.client = client;
    }

    async getMessageTemplateUniqueNames(): Promise<string[]> {
        let { data, error } = await this.client
            .from('message_template')
            .select('*')
        if (error) throw error
        const uniqueTemplates: string[] = []
        data?.forEach((messageTemplate) => {
            if (!uniqueTemplates.includes(messageTemplate.name)) {
                uniqueTemplates.push(messageTemplate.name)
            }
        })
        return uniqueTemplates
    }

    async getMessageTemplateLanguages(messageTemplateName: string): Promise<string[]> {
        let { data, error } = await this.client
            .from('message_template')
            .select('language')
            .eq('name', messageTemplateName)
            if (error) throw error
        return data?.map(item => item.language) || []
    }
}