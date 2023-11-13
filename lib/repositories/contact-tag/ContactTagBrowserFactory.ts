import { ContactTagRepository } from "./ContactTagRepository";
import { ContactTagRepositorySupabaseImpl } from "./ContactTagRepositorySupabaseImpl";
import { createClient as createBrowserClient } from "@/utils/supabase-browser";

export default class ContactTagBrowserFactory {
    private static _instance: ContactTagRepository;
    public static getInstance(): ContactTagRepository {
        if (!ContactTagBrowserFactory._instance) {
            const client = createBrowserClient();
            ContactTagBrowserFactory._instance = new ContactTagRepositorySupabaseImpl(client)
        }
        return ContactTagBrowserFactory._instance
    }
}
