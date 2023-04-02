'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "../../../utils/supabase-browser";
import TailIn from "../TailIn";

export default function ReceivedImageMessageUI({ message }: { message: DBMessage }) {
    const [supabase] = useState(() => createClient())
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    useEffect(() => {
        if (message.media_url) {
            supabase
                .storage
                .from('media')
                .createSignedUrl(message.media_url, 60)
                .then(({ data, error }) => {
                    if (error) throw error
                    setImageUrl(data.signedUrl)
                })
        }
    })
    return (
        <div>
            <div className="inline-block">
                <div className="inline-block h-full text-incoming-background float-left">
                    <TailIn />
                </div>
                <div className="bg-incoming-background inline-block p-2 rounded-b-lg rounded-tr-lg shadow-message">
                    {(() => {
                        if (imageUrl) {
                            return <img alt="Image received" width="240" className="max-w-md" src={imageUrl} />
                        }
                    })()}
                </div>
            </div>
        </div>
    )
}