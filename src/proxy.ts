// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'
import { auth } from './back/lib/auth'

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    const isMemberRoute = pathname.startsWith('/account')
    const isAdminRoute = pathname.startsWith('/admin')

    if (!isMemberRoute && !isAdminRoute) return NextResponse.next()

    // Fast check : cookie présent ?
    const sessionCookie = getSessionCookie(request)
    if (!sessionCookie) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
    }

    if (isAdminRoute) {
        const session = await auth.api.getSession({ headers: request.headers })
        if (session?.user?.role !== 'admin') {
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/account/:path*',
        '/admin/:path*',
    ],
}
