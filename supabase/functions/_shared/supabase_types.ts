import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Database } from "./database.types.ts";

export type SupabaseClientType = ReturnType<typeof createClient<Database>>
