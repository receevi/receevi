import { createClient as createBrowserClient } from "@/utils/supabase-browser";
import { BroadcastFromDB, BroadcastRepository } from "./BroadcastRepository";

type SupabaseClientType = ReturnType<typeof createBrowserClient>

export class BroadcastRepositorySupabaseImpl implements BroadcastRepository {
    private client;
    constructor(client: SupabaseClientType) {
        this.client = client;
    }

    async getAllBroadcasts(page: number): Promise<BroadcastFromDB[]> {
        const pageSize = 10;
        const pageIndex = page - 1;
        let { data, error } = await this.client
            .from('broadcast')
            .select('*')
            .range(pageIndex * pageSize, (pageIndex + 1) * pageSize - 1)
            .order('created_at', { ascending: false })
        if (error) throw error
        return data || [];
    }
}