import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase-server'
import constants from '@/lib/constants'

export default async function Home() {
  const supabase = createClient()
  const session = await supabase.auth.getSession()
  if (session.data.session) {
    redirect(constants.DEFAULT_ROUTE)
  } else {
    redirect('/login')
  }
}
