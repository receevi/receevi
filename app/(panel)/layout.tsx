import { redirectIfUnauthorized } from "@/lib/supabase/supabase-redirect";
import { ReactNode } from "react";
import PanelClient from './layoutClient';

export default async function Panel({ children }: { children: ReactNode }) {
    await redirectIfUnauthorized()
    return (
        <PanelClient>
            {children}
        </PanelClient>
    )
}
