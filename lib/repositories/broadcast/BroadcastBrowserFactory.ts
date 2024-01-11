import { BroadcastRepository } from "./BroadcastRepository";
import { BroadcastRepositorySupabaseImpl } from "./BroadcastRepositorySupabaseImpl";
import { createClient as createBrowserClient } from "@/utils/supabase-browser";

export default class BroadcastBrowserFactory {
    private static _instance: BroadcastRepository;
    public static getInstance(): BroadcastRepository {
        if (!BroadcastBrowserFactory._instance) {
            const client = createBrowserClient();
            BroadcastBrowserFactory._instance = new BroadcastRepositorySupabaseImpl(client)
        }
        return BroadcastBrowserFactory._instance
    }
}
