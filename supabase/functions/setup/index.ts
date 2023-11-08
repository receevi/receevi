import { serve } from "deno-server"
import { createClient } from 'supabase-js'
import { corsHeaders } from '../_shared/cors.ts'
import { Response } from "https://esm.sh/v133/@supabase/node-fetch@2.6.14/denonext/node-fetch.mjs";
import { MessageTemplateSetup } from "./message_template.ts";

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

    const messageTemplaetSetup = new MessageTemplateSetup(supabase);
    await messageTemplaetSetup.execute();

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
