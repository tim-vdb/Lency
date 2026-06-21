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
    if (!process.env.RESEND_API_KEY) {
        console.error('[send-email-change-confirmation] RESEND_API_KEY is not defined');
        throw new Error('Email service not configured');
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
    const confirmationUrl = `${baseUrl}/confirm-email-change?token=${confirmationToken}`

    try {
        console.warn('[send-email-change-confirmation] Sending email to:', email);
        await resend.emails.send({
            from: 'support@infos.lency.net',
            to: email,
            subject: 'Confirmez votre nouvelle adresse email — Lency',
            react: EmailChangeConfirmation({
                firstName,
                confirmationUrl,
            }),
        })
        console.warn('[send-email-change-confirmation] Email sent successfully');
    } catch (error) {
        console.error('[send-email-change-confirmation] Error:', error)
        throw error
    }
}
