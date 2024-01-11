import { BroadcastRepository } from "./BroadcastRepository";
import { BroadcastRepositorySupabaseImpl } from "./BroadcastRepositorySupabaseImpl";
import { createClient as createServerClient } from "@/utils/supabase-server";

export default class BroadcastServerFactory {
    private static _instance: BroadcastRepository;
    public static getInstance(): BroadcastRepository {
        if (!BroadcastServerFactory._instance) {
            const client = createServerClient();
            BroadcastServerFactory._instance = new BroadcastRepositorySupabaseImpl(client)
        }
        return BroadcastServerFactory._instance
    }
}
