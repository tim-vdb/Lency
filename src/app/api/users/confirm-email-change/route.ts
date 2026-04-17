import { auth } from '@/back/lib/auth'
import { UsersService } from '@/back/services/users.service'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    try {
        const rawToken = req.nextUrl.searchParams.get('token')

        if (!rawToken) {
            return NextResponse.json({ error: 'Token manquant' }, { status: 400 })
        }

        try {
            await UsersService.confirmEmailChange(rawToken)
        } catch (err) {
            if (err instanceof Error) {
                if (err.message === 'TOKEN_INVALID_OR_EXPIRED') {
                    return NextResponse.json({ error: 'Lien de confirmation invalide ou expiré' }, { status: 400 })
                }
                if (err.message === 'NO_PENDING_EMAIL') {
                    return NextResponse.json({ error: "Aucun changement d'email en attente" }, { status: 400 })
                }
            }
            throw err
        }

        // Revoke all sessions so the next login uses the new email
        await auth.api.revokeSessions({
            headers: await headers(),
        }).catch((err) => {
            console.error('Failed to revoke sessions after email change:', err)
        })

        const redirectUrl = new URL('/account/profile', req.nextUrl.origin)
        redirectUrl.searchParams.set('emailChanged', 'true')

        return NextResponse.redirect(redirectUrl)
    } catch (error) {
        console.error('Error in confirm-email-change:', error)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}
