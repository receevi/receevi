import { redirect } from 'next/navigation'
import { createClient } from '../utils/supabase-server'

export default async function Home() {
  const supabase = createClient()
  const session = await supabase.auth.getSession()
  if (session.data.session) {
    redirect('/chats')
  } else {
    redirect('/login')
  }
}
