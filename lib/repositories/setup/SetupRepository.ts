import { Database } from "@/lib/database.types";

export type AppSetup = Database['public']['Tables']['setup']['Row'];


export interface SetupRepository {
    getIncompleteItems(): Promise<AppSetup[]>
}
