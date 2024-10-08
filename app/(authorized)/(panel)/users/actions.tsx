'use server'

import { createServiceClient } from '@/lib/supabase/service-client'
import { createClient } from '@/utils/supabase-server'

export async function deleteUser(userId: string) {
    const supabaseServer = createClient()
    const {data: session, error: sessionGetError} = await supabaseServer.auth.getSession()
    if (sessionGetError) {
        throw sessionGetError
    }
    const userRole = session.session?.user?.user_metadata?.custom_user_role
    console.log('userRole', userRole)
    if (userRole !== 'admin') {
        return { success: false, message: 'You are not authorized to create users' }
    }

    // await new Promise(() => setTimeout(() => {}, 5000))

    const supabase = createServiceClient()
    const { data, error } = await supabase.auth.admin.deleteUser(userId)
    if (error) {
        throw error
    }
}