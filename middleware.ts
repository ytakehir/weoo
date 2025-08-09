import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma/client'
import { updateSession } from '@/lib/supabase/middleware'
import type { AuthNextRequest } from '@/types/next-auth'
import { auth } from './auth'

export default auth(async (req: AuthNextRequest) => {
  const response = await updateSession(req)
  const token = await getToken({ req })
  const session = req.auth

  const pathname = req.nextUrl.pathname
  const publicPath = ['/', '/signin', '/verify', '/pricing', '/faq', '/privacy', '/terms']
  const isPublic = publicPath.some((p) => pathname.startsWith(p))

  if (!token) {
    if (isPublic) {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/signin', req.url))
  }

  const userId = token.sub

  if (session && !isPublic) {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: userId,
        status: 'active'
      }
    })

    if (!subscription) {
      return NextResponse.redirect(new URL('/pricing', req.url))
    }
  }

  return response
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',

    // private path
    '/onboarding'
  ]
}
