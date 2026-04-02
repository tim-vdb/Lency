import { auth } from '@/back/lib/auth'
import { getUser } from '@/back/lib/auth-session'
import { sendEmailChangeConfirmation } from '@/back/lib/send-email-change-confirmation'
import { UsersService } from '@/back/services/users.service'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const { currentPassword, newEmail } = await req.json()

        if (!currentPassword || !newEmail) {
            return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
        }

        const user = await getUser()
        if (!user) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
        }

        const hasCredentials = await UsersService.hasCredentialAccount(user.id)

        if (hasCredentials) {
            // Verify password via Better Auth (avoids raw bcrypt in route handler)
            try {
                await auth.api.signInEmail({
                    body: { email: user.email, password: currentPassword },
                    headers: await headers(),
                })
            } catch {
                return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 400 })
            }
        }
        // OAuth-only users: skip password check, send link directly to new email

        let rawToken: string
        try {
            rawToken = await UsersService.initiateEmailChange(user.id, newEmail)
        } catch (err) {
            if (err instanceof Error && err.message === 'EMAIL_ALREADY_IN_USE') {
                return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 409 })
            }
            throw err
        }

        sendEmailChangeConfirmation({
            email: newEmail,
            firstName: user.firstname,
            confirmationToken: rawToken,
        }).catch((err) => {
            console.error('Failed to send email change confirmation:', err)
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error in verify-email-change:', error)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}
