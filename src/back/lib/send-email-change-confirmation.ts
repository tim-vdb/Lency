import { Resend } from 'resend'
import EmailChangeConfirmation from '@/front/emails/EmailChangeConfirmation'

interface SendEmailChangeConfirmationParams {
    email: string
    firstName?: string | null
    confirmationToken: string
}

export async function sendEmailChangeConfirmation({
    email,
    firstName,
    confirmationToken,
}: SendEmailChangeConfirmationParams): Promise<void> {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const confirmationUrl = `${baseUrl}/api/users/confirm-email-change?token=${confirmationToken}`

    try {
        await resend.emails.send({
            from: process.env.RESEND_FROM_AUTH_EMAIL || 'noreply@lency.net',
            to: email,
            subject: 'Confirmez votre nouvelle adresse email - Lency',
            react: EmailChangeConfirmation({
                firstName,
                confirmationUrl,
            }),
        })
    } catch (error) {
        console.error('Failed to send email change confirmation:', error)
        throw error
    }
}
