"use client";

import { useSupabase } from "@/components/supabase-provider";
import { useSupabaseUser } from "@/components/supabase-user-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LockIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export default function PasswordUpdatePage() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleUpdatePassword = useCallback(async (event: any) => {
    event.preventDefault();

    // Reset any previous error message
    setError("");
    // Validate that the passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Logic to handle password update with Supabase
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setError(updateError.message);
      } else {
        // Handle successful password update (e.g., show a success message)
        console.log("Password updated successfully!");
        router.push("/");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  }, [newPassword, confirmPassword, supabase, router]);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center">Update Password</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleUpdatePassword}>
          <div className="mb-4">
            <Label htmlFor="new-password">New Password:</Label>
            <div className="relative mt-2">
              <Input
                id="new-password"
                name="new-password"
                type="password"
                required
                className="pl-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <LockIcon className="absolute left-2 top-2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="mb-6">
            <Label htmlFor="confirm-password">Confirm Password:</Label>
            <div className="relative mt-2">
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                className="pl-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <LockIcon className="absolute left-2 top-2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
}
