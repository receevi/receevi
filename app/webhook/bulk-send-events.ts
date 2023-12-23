import { createServiceClient } from "@/lib/supabase/service-client";
import { WebhookMessage, WebhookStatus } from "@/types/webhook";

export async function updateBroadCastStatus(status: WebhookStatus) {
  const supabase = createServiceClient()
  const update_obj: {
    sent_at?: Date,
    delivered_at?: Date,
    read_at?: Date,
  } = {}
  if (status.status === 'sent') {
    update_obj.sent_at = new Date(Number.parseInt(status.timestamp) * 1000)
  } else if (status.status === 'delivered') {
    update_obj.delivered_at = new Date(Number.parseInt(status.timestamp) * 1000)
  } else if (status.status === 'read') {
    update_obj.read_at = new Date(Number.parseInt(status.timestamp) * 1000)
  } else {
    console.warn(`Unknown status : ${status.status}`)
  }
  const { data: broadcastContactData, error: broadcastContactUpdateError } = await supabase
    .from('broadcast_contact')
    .update(update_obj)
    .eq('wam_id', status.id)
    .select()
    .single()
  if (broadcastContactUpdateError) throw broadcastContactUpdateError

  if (status.status === 'read') {
    const argsToUpdateCount = {
      read_count_to_be_added: 1,
      b_id: broadcastContactData.broadcast_id
    }
    const { error: countUpdateError } = await supabase.rpc('add_read_count_to_broadcast', argsToUpdateCount)
    if (countUpdateError) {
      console.error(`Error while updating read count for status.id: ${status.id}`, countUpdateError)
    }
  } else if (status.status === 'delivered') {
    const argsToUpdateCount = {
      delivered_count_to_be_added: 1,
      b_id: broadcastContactData.broadcast_id
    }
    const { error: countUpdateError } = await supabase.rpc('add_delivered_count_to_broadcast', argsToUpdateCount)
    if (countUpdateError) {
      console.error(`Error while updating delivered count for status.id: ${status.id}`, countUpdateError)
    }
  } else if (status.status === 'sent') {
    const argsToUpdateCount = {
      sent_count_to_be_added: 1,
      b_id: broadcastContactData.broadcast_id
    }
    const { error: countUpdateError } = await supabase.rpc('add_sent_count_to_broadcast', argsToUpdateCount)
    if (countUpdateError) {
      console.error(`Error while updating sent count for status.id: ${status.id}`, countUpdateError)
    }
  }
}

export async function updateBroadCastReplyStatus(messages: WebhookMessage[]) {
  if (messages.length > 0) {
    const supabase = createServiceClient()
    const message = messages[0]
    const { data: broadcastContactData, error: broadcastGetError } = await supabase
      .from('broadcast_contact')
      .select('*')
      .eq('contact_id', message.from)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    if (broadcastGetError) throw broadcastGetError
    if (broadcastContactData && !broadcastContactData.reply_counted) {
      const { error: countUpdateError } = await supabase.rpc('add_replied_to_broadcast_contact', {
        b_id: broadcastContactData.broadcast_id,
        replied_count_to_be_added: 1
      })
      if (countUpdateError) {
        console.error(`Error while updating count for broadcastContactData.broadcast_id: ${broadcastContactData.broadcast_id}, message.id: ${message.id}`, countUpdateError)
      } else {
        const { error: broadcastContactUpdateError } = await supabase
          .from('broadcast_contact')
          .update({ reply_counted: true })
          .eq('id', broadcastContactData.id)
        if (broadcastContactUpdateError) {
          console.error(`Error while updating broadcastContactData.id: ${broadcastContactData.id}, message.id: ${message.id}`, broadcastContactUpdateError)
        }
      }
    }
  }
}
