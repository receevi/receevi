import { ContactRepository } from "./ContactRepository";
import { ContactRepositorySupabaseImpl } from "./ContactRepositorySupabaseImpl";
import { createClient as createBrowserClient } from "@/utils/supabase-browser";

export default class ContactBrowserFactory {
    private static _instance: ContactRepository;
    public static getInstance(): ContactRepository {
        if (!ContactBrowserFactory._instance) {
            const client = createBrowserClient();
            ContactBrowserFactory._instance = new ContactRepositorySupabaseImpl(client)
        }
        return ContactBrowserFactory._instance
    }
}
