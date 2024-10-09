"use client";

import { useSupabase } from "@/components/supabase-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LockIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export default function ForgotPasswordClientComponent() {
    const { supabase } = useSupabase();
    const router = useRouter();
    const [message, setMessage] = useState<string | null>(null);
    const emailRef = useRef<HTMLInputElement | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const email = emailRef.current?.value;
        if (!email) return; // Ensure email is not null

        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://example.com/update-password',
        });

        if (error) {
            throw error;
        }

        // Set success message to inform the user
        setMessage(`Check your email for the password reset link!`);

        // Clear email input field
        if (emailRef.current) {
            emailRef.current.value = '';
        }

        console.log('data', data);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
                <h2 className="text-2xl font-semibold mb-6 text-center">Forgot Password</h2>
                {message && <div className="mb-4 text-green-600 text-center">{message}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Label htmlFor="email">Email:</Label>
                        <div className="relative mt-2">
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="pl-10"
                                ref={emailRef}
                            />
                            <MailIcon className="absolute left-2 top-2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                    <Button type="submit" className="w-full">Send Reset Link</Button>
                </form>
                <div className="mt-4 text-center">
                    <button onClick={() => router.back()} className="text-gray-600 underline">Back to Login</button>
                </div>
            </div>
        </div>
    );
}
