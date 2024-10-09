"use client";

import { useSupabase } from "../../components/supabase-provider";
import { login } from "./action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LockIcon, MailIcon } from "lucide-react";
import Link from "next/link";

export default function LoginClientComponent() {
    const { supabase } = useSupabase();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
                <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
                <form>
                    <div className="mb-4">
                        <Label htmlFor="email">Email:</Label>
                        <div className="relative mt-2">
                            <Input id="email" name="email" type="email" required className="pl-10" />
                            <MailIcon className="absolute left-2 top-2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                    <div className="mb-6">
                        <Label htmlFor="password">Password:</Label>
                        <div className="relative mt-2">
                            <Input id="password" name="password" type="password" required className="pl-10" />
                            <LockIcon className="absolute left-2 top-2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                    <Button type="submit" className="w-full" formAction={login}>Log in</Button>
                </form>
                <div className="mt-4 text-center">
                    <Link href="/login/forgot-password" className="text-gray-600 underline">Forgot Password?</Link>
                </div>
            </div>
        </div>
    );
}
