import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { Response } from "https://esm.sh/v133/@supabase/node-fetch@2.6.14/denonext/node-fetch.mjs";
import { syncMessageTemplates } from "./utils.ts";

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }
    let success = false;
    try {
        const authorizationHeader = req.headers.get('Authorization')!
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
            { global: { headers: { Authorization: authorizationHeader } } }
        )
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return new Response('', { status: 401, headers: corsHeaders })
        }
        await syncMessageTemplates(supabase);
        success = true
    } catch (e) {
        console.error(e)
        success = false
    }
    const data = {
        success: success,
    }
    return new Response(
        JSON.stringify(data),
        { headers: { "Content-Type": "application/json", ...corsHeaders } },
    )
})
