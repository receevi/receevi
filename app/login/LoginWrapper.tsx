import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase-server";

export default async function LoginWrapper({ children }: { children: React.ReactNode }) {
    const supabase = createClient()
    const { data } = await supabase.auth.getUser()
    if (data.user) {
        redirect('/post-login')
    } else {
        return (
            <>
                {children}
            </>
        )
    }
}