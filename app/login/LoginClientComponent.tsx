"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSupabase } from "../../components/supabase-provider";

export default function LoginClientComponent() {
    const { supabase } = useSupabase()
    return (
        <div className="max-w-lg m-auto mt-48">
            <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={[]}
            />
        </div>
    )
}
