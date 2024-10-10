'use client'

import { User } from "@supabase/supabase-js"
import { createContext, useContext } from "react"

type SupabaseRoleContext = {
    user: User | undefined
}

const Context = createContext<SupabaseRoleContext | undefined>(undefined)

export default function SupabaseUserProvider({ user, children }: {user: User | undefined, children: React.ReactNode }) {
    return (
        <Context.Provider value={{ user }}>
            {children}
        </Context.Provider>
    )
}

export function useSupabaseUser() {
    const context = useContext(Context)
    if (context === undefined) {
        throw new Error('useSupabaseRole must be used within a SupabaseRoleProvider')
    }
    return context
}

export function useUserRole() {
    const { user } = useSupabaseUser()
    return user?.user_metadata?.custom_user_role
}
