import { Database } from "../_shared/database.types.ts";

export type Broadcast = Database['public']['Tables']['broadcast']['Row']
export type BroadcastContact = Database['public']['Tables']['broadcast_contact']['Row']

export type ContactBatch = {
    batchId: string
    contactWaId: string
}