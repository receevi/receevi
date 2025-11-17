'use client'

import { AudioMessage } from "@/types/Message";
import { useSupabase } from '@/components/supabase-provider'
import { useEffect, useState } from 'react'

type ReceivedAudioMessageUIProps = {
    message: DBMessage
}

export default function ReceivedAudioMessageUI({ message }: ReceivedAudioMessageUIProps) {
    const { supabase } = useSupabase()
    const [audioUrl, setAudioUrl] = useState<string | null>(null)

    useEffect(() => {
        if (message.media_url) {
            supabase
                .storage
                .from('media')
                .createSignedUrl(message.media_url, 60)
                .then(({ data, error }) => {
                    if (error) throw error
                    setAudioUrl(data.signedUrl)
                })
                .catch(error => {
                    console.error('Error loading audio:', error)
                })
        }
    }, [message.media_url, supabase])

    return (
        <audio
            controls
            preload="metadata"
            src={audioUrl || undefined}
            className="w-full min-w-[280px]"
            aria-label="Voice message"
        />
    )
}
