import { Resend } from 'resend'
import PasswordChangeConfirmation from '@/front/emails/PasswordChangeConfirmation'

interface SendPasswordChangeConfirmationParams {
    email: string
    firstName?: string | null
    confirmationToken: string
}

export async function sendPasswordChangeConfirmation({
    email,
    firstName,
    confirmationToken,
}: SendPasswordChangeConfirmationParams): Promise<void> {
    if (!process.env.RESEND_API_KEY) {
        console.error('[send-password-change-confirmation] RESEND_API_KEY is not defined')
        throw new Error('Email service not configured')
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
    const confirmationUrl = `${baseUrl}/confirm-password-change?token=${confirmationToken}`

    try {
        console.log('[send-password-change-confirmation] Sending email to:', email)
        await resend.emails.send({
            from: 'support@infos.lency.net',
            to: email,
            subject: 'Confirmez votre changement de mot de passe — Lency',
            react: PasswordChangeConfirmation({
                firstName,
                confirmationUrl,
            }),
        })
        console.log('[send-password-change-confirmation] Email sent successfully')
    } catch (error) {
        console.error('[send-password-change-confirmation] Error:', error)
        throw error
    }
}
