'use client'

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase-browser";

export default function ReceivedVideoMessageUI({ message }: { message: DBMessage }) {
    const [supabase] = useState(() => createClient())
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    useEffect(() => {
        if (message.media_url) {
            supabase
                .storage
                .from('media')
                .createSignedUrl(message.media_url, 60)
                .then(({ data, error }) => {
                    if (error) throw error
                    setVideoUrl(data.signedUrl)
                })
                .catch(e => console.error(e))
        }
    }, [supabase.storage, message.media_url, setVideoUrl])
    return (
        <video className="h-[144px]" controls src={videoUrl || ''} />
    )
}
