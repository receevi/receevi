import { createClient } from "@/utils/supabase-server";
import { redirect } from "next/navigation";

export async function redirectIfUnauthorized() {
    const supabase = createClient()
    const {
        data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
        redirect('/login')
    }
}