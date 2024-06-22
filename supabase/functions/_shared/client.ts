import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Database } from "./database.types.ts";

export function createSupabaseClient(authorizationHeader: string) {
    return createClient<Database>(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        { global: { headers: { Authorization: authorizationHeader } } }
    )
}

export type SupabaseClientType = ReturnType<typeof createSupabaseClient>

