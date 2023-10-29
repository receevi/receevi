import { DBTables } from "@/lib/enums/Tables";
import { createClient as createBrowserClient } from "@/utils/supabase-browser";
import { Contact } from "../../../types/contact";
import { AppSetup, SetupRepository } from "./SetupRepository";

type SupabaseClientType = ReturnType<typeof createBrowserClient>

export class SetupRepositorySupabaseImpl implements SetupRepository {
    private client;
    constructor(client: SupabaseClientType) {
        this.client = client;
    }
    async getIncompleteItems(
    ): Promise<AppSetup[]> {
        const { data, error } = await this.client
            .from(DBTables.Setup)
            .select('*')
            .filter("done_at", "is", null)
        if (error) throw error
        return data;
    }
}