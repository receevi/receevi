import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'
export const createClient = () => createPagesBrowserClient<Database>()
