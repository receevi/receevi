type DBMessage = {
    chat_id: number
    created_at: string
    delivered_at: string | null
    id: number
    is_received: boolean
    media_url: string | null
    message: Json
    read_at: string | null
    read_by_user_at: string | null
    sent_at: string | null
    wam_id: string
  }