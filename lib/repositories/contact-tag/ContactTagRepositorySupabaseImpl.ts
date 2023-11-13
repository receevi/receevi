import { DBTables } from "@/lib/enums/Tables";
import { createClient as createBrowserClient } from "@/utils/supabase-browser";
import { ContactTagColumnName, ContactTagFilterArray, ContactTagFromDB, ContactTagRepository } from "./ContactTagRepository";

type SupabaseClientType = ReturnType<typeof createBrowserClient>

export class ContactTagRepositorySupabaseImpl implements ContactTagRepository {
    private client;
    constructor(client: SupabaseClientType) {
        this.client = client;
    }

    async getContactTags(): Promise<string[]> {
        let { data, error } = await this.client
            .from('contact_tag')
            .select('*')
        if (error) throw error
        return data?.map((contact_tag) => contact_tag.name) ?? []
    }
}