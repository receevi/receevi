import { redirectIfUnauthorized } from "@/lib/supabase/supabase-redirect";
import { ReactNode } from "react";

export default async function Panel({ children }: { children: ReactNode }) {
    await redirectIfUnauthorized()
    return (
        <>
            {children}
        </>
    )
}
