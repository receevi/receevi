// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { corsHeaders } from '../_shared/cors.ts';
import { parse } from "https://deno.land/std@0.218.2/csv/mod.ts";
import { createSupabaseClient } from "../_shared/client.ts";
import { Database } from "../_shared/database.types.ts";

export type ContactTag = Database['public']['Tables']['contact_tag']['Insert']
export type Contact = Database['public']['Tables']['contacts']['Insert']

type CSVData = {
  name: string,
  number: string,
  tags: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const authorizationHeader = req.headers.get('Authorization')!
  const supabase = createSupabaseClient(authorizationHeader)

  const csvData = await req.text()

  const contactData = parse(csvData, {
    skipFirstRow: true,
    strip: true,
    columns: ["name", "number", "tags"],
  })
  const niceData: Contact[] = []
  const uniqueTags: ContactTag[] = []
  for (const row of contactData) {
    const niceRow = {
      profile_name: row.name,
      wa_id: row.number,
      tags: row.tags.split(',').map((tag: string) => tag.trim())
    }
    niceData.push(niceRow)
    if (niceRow.tags.length > 0) {
      niceRow.tags.forEach((tag: string) => {
        if (!uniqueTags.find((tagItem) => tagItem.name === tag)) {
          uniqueTags.push({ name: tag})
        }
      })
    }
  }
  const { error: contactTagsInsertError } = await supabase
    .from('contact_tag')
    .upsert(uniqueTags, { onConflict: 'name' })
  if (contactTagsInsertError) throw contactTagsInsertError

  const { error: contactInsertError } = await supabase
    .from('contacts')
    .upsert(niceData)
  if (contactInsertError) throw contactInsertError

  await new Promise((resolve) => setTimeout(resolve, 5000))

  return new Response(
    JSON.stringify({ message: "hello" }),
    { headers: { "Content-Type": "application/json", ...corsHeaders } },
  )
})

// To invoke:
// curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
