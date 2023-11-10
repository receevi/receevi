import 'server-only'

import SupabaseListener from '../components/supabase-listener'
import SupabaseProvider from '../components/supabase-provider'
import { createClient } from '@/utils/supabase-server'
import './globals.css'
import NextTopLoader from 'nextjs-toploader';

// do not cache this layout
export const revalidate = 0

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  return (
    <html lang="en">
      <head>
        <title>Receevi</title>
        <meta name="description" content="Whatsapp Cloud API Webhook" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <NextTopLoader color="#000"/>
        <SupabaseProvider>
          <SupabaseListener serverAccessToken={session?.access_token} />
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
}
