import { redirectIfUnauthorized } from "@/lib/supabase/supabase-redirect";
import { ReactNode } from "react";
import PanelClient from './layoutClient';

export default async function Panel({ children }: { children: ReactNode }) {
    return (
        <PanelClient>
            {children}
        </PanelClient>
    )
}
