// proxy.ts (à la racine)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Routes membres (dashboard, account)
    const memberRoutes = ['/dashboard', '/account']
    const isMemberRoute = memberRoutes.some(route => pathname.startsWith(route))

    // Routes admin
    const isAdminRoute = pathname.startsWith('/admin')

    const sessionCookie = getSessionCookie(request)

    if (isMemberRoute || isAdminRoute) {
        if (!sessionCookie) {
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('callbackUrl', pathname)
            return NextResponse.redirect(loginUrl)
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