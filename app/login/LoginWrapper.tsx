import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase-server";

export default async function LoginWrapper({ children }: { children: React.ReactNode }) {
    const supabase = createClient()
    const session = await supabase.auth.getSession()
    if (session.data.session) {
        redirect('/chats')
    } else {
        return (
            <>
                {children}
            </>
        )
    }
}