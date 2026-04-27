import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // 1. Refresh the Supabase session token
  const response = await updateSession(request)

  // 2. Protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Create a temporary client just to check auth status
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll() {}, // We don't need to set cookies here, updateSession does it
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // If no user and trying to access an admin page that is NOT login
    if (!user && request.nextUrl.pathname !== '/admin/login') {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/admin/login'
      return NextResponse.redirect(loginUrl)
    }

    // If user IS logged in but tries to access login page
    if (user && request.nextUrl.pathname === '/admin/login') {
      const dashboardUrl = request.nextUrl.clone()
      dashboardUrl.pathname = '/admin/dashboard'
      return NextResponse.redirect(dashboardUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
