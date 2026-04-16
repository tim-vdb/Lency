import PasswordChangedConfirmation from '@/front/emails/PasswordChangedConfirmation';
import { Resend } from 'resend';

interface SendPasswordChangedEmailParams {
    email: string;
    firstName?: string | null;
}

export async function sendPasswordChangedEmail({ email, firstName }: SendPasswordChangedEmailParams): Promise<void> {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const sender = process.env.RESEND_FROM_AUTH_EMAIL ?? 'Lency <no-reply@infos.lency.net>';

    const { error } = await resend.emails.send({
        from: sender,
        to: [email],
        subject: 'Votre mot de passe a été modifié - Lency',
        react: PasswordChangedConfirmation({ firstName }),
    });

    if (error) {
        console.error('Failed to send password changed confirmation email:', error.message);
        throw new Error(error.message);
    }
}
