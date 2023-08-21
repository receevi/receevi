import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import type { Database } from './lib/database.types'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createMiddlewareSupabaseClient<Database>({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    return res
  }

  const loginUrl = new URL('/login', req.url)
  loginUrl.searchParams.set('from', req.nextUrl.pathname)

  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
      '/api/:path*',
      '/changepassword/:path*',
  ],
}
