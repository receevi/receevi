import { createClient } from 'supabase-js'
import { Database } from "./database.types.ts";

export type SupabaseClientType = ReturnType<typeof createClient<Database>>
