import { serve } from "deno-server";
import { Response } from "https://esm.sh/v133/@supabase/node-fetch@2.6.14/denonext/node-fetch.mjs";
import { SupabaseClientType, createSupabaseClient } from "../_shared/client.ts";
import { PARALLEL_BATCH_COUNT, PROCESSING_LIMIT } from "../_shared/constants.ts";
import { corsHeaders } from '../_shared/cors.ts';

type BulkSendRequest = {
  name: string,
  messageTemplate: string,
  language: string,
  contactTags: string[],
}

async function markContactsForSend(supabase: SupabaseClientType, broadcastId: string, tags: string[]) {
  let from = 0
  let lastFetchedCount;
  let scheduledCount = 0;
  const batches = []
  do {
    const batchId = crypto.randomUUID()
    const to = from + PROCESSING_LIMIT - 1
    console.log(`BroadcastId: ${broadcastId} - Analyzing contacts to send message ${from} ${to}...`)
    const { data: contacts, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: true })
      .overlaps('tags', tags)
      .range(from, to)
    if (error) throw error
    const broadcastContacts = contacts.map((item) => {
      return {
        broadcast_id: broadcastId,
        contact_id: item.wa_id,
        batch_id: batchId
      }
    })
    await supabase
      .from('broadcast_contact')
      .insert(broadcastContacts)
    batches.push(batchId)
    const { error: errorBatchInsert } = await supabase.from('broadcast_batch').insert({
      'id': batchId,
      'broadcast_id': broadcastId,
      'scheduled_count': contacts.length,
    })
    if (errorBatchInsert) throw errorBatchInsert
    lastFetchedCount = contacts.length
    scheduledCount += contacts.length
    from = from + PROCESSING_LIMIT
  } while (lastFetchedCount == PROCESSING_LIMIT)
  return { scheduledCount, batches }
}

serve(async (req) => {
  const authorizationHeader = req.headers.get('Authorization')!
  const supabase = createSupabaseClient(authorizationHeader)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response('', { status: 401, headers: corsHeaders })
  }
  const requestData: BulkSendRequest = await req.json()

  const { data: broadcast, error } = await supabase
    .from('broadcast')
    .insert([
      {
        name: requestData.name,
        template_name: requestData.messageTemplate,
        contact_tags: requestData.contactTags,
        language: requestData.language
      },
    ])
    .select()
  if (error) throw error
  if (broadcast.length <= 0) {
    throw new Error(`failed to create broadcast. name: ${requestData.name} template_name: ${requestData.messageTemplate}`)
  }
  const broadcastId: string = broadcast[0].id
  console.log(`Broadcast created - ${broadcastId}`)
  const contactsMarkedForSent = await markContactsForSend(supabase, broadcastId, requestData.contactTags)
  console.log(`BroadcastId: ${broadcastId} - ${contactsMarkedForSent.scheduledCount} contacts marked for send`)

  const { error: errorUpdateBroadcastSC } = await supabase
    .from('broadcast')
    .update({ scheduled_count: contactsMarkedForSent.scheduledCount })
    .eq('id', broadcastId)
  if (errorUpdateBroadcastSC) throw errorUpdateBroadcastSC

  for (let i = 0; i < Math.min(PARALLEL_BATCH_COUNT, contactsMarkedForSent.batches.length); i++) {
    supabase.functions.invoke('send-message-batch', {
      body: {
        broadcast: broadcast[0]
      }
    })
  }
  console.log(`BroadcastId: ${broadcastId} - ${PARALLEL_BATCH_COUNT} workers invoked`)

  return new Response(
    '{"success": true}',
    { headers: { "Content-Type": "application/json", ...corsHeaders } },
  )
})
