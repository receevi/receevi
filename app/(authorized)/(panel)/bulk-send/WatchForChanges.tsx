"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase-browser";
import { BroadcastFromDB } from "@/lib/repositories/broadcast/BroadcastRepository";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/utils/useDebounce";

export default function WatchForChanges({ page }: { page: number }) {
    const [supabase] = useState(() => createClient())
    const router = useRouter();
    const refreshRouterDebounce = useDebounce(() => {
        router.refresh()
    }, 2000);

    useEffect(() => {
        const channel = supabase
            .channel('schema-db-changes')
            .on<BroadcastFromDB>('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'broadcast',
            },
            payload => {
                refreshRouterDebounce();
            }
        )
        .subscribe()
        return () => { supabase.removeChannel(channel) }
    });
    return <></>
}