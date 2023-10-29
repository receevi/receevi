import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

async function downloadMessageTemplates(supabase) {
  const whatsappBusinessAccountId = Deno.env.get('WHATSAPP_BUSINESS_ACCOUNT_ID')
  if (!whatsappBusinessAccountId) throw new Error("WHATSAPP_BUSINESS_ACCOUNT_ID environment variable is not set")

  let token = Deno.env.get('WHATSAPP_ACCESS_TOKEN')
  const fetchLimit = 10
  let next = `https://graph.facebook.com/v17.0/${whatsappBusinessAccountId}/message_templates?limit=${fetchLimit}`;
  while (next) {
    console.log(`Fetch url: ${next}`)
    const response = await fetch(next, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    })
    const jsonResponse = await response.json()
    const databaseInput = jsonResponse.data.map(remoteData => {
      const { id, name, category, previous_category, status, language, components, ...rest } = remoteData
      const restOfTheKeys = Object.keys(rest)
      if (restOfTheKeys.length > 0) {
        console.warn("There are new columns from facebook console", Object.keys(rest))
      }
      return {
        id: id,
        name: name,
        category: category,
        previous_category: previous_category,
        status: status,
        language: language,
        components: components,
        updated_at: new Date(),
      }
    })
    const { data, error } = await supabase
      .from('message_template')
      .upsert(databaseInput)
    if (error) throw error
    next = jsonResponse.paging.next
  }
}

async function downloadMessageTemplateWrapper(supabase) {
  const { data1, error1 } = await supabase
    .from('setup')
    .update({ in_progress: true })
    .eq('name', 'download_message_templates')
  if (error1) throw error1
  await downloadMessageTemplates(supabase)
  const { data2, error2 } = await supabase
    .from('setup')
    .update({ in_progress: false, done_at: new Date() })
    .eq('name', 'download_message_templates')
  if (error2) throw error2
}

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

    await downloadMessageTemplateWrapper(supabase);
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
