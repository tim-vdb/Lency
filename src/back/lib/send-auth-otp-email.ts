import ResetPasswordOTP from '@/front/emails/ResetPasswordOTP';
import VerifyEmailOTP from '@/front/emails/VerifyEmailOTP';
import { UsersService } from '@/back/services/users.service';
import { Resend } from 'resend';

type OtpType = 'sign-in' | 'email-verification' | 'forget-password' | string;

interface SendAuthOtpEmailParams {
    email: string;
    otp: string;
    type: OtpType;
}

export async function sendAuthOtpEmail({ email, otp, type }: SendAuthOtpEmailParams): Promise<void> {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const user = await UsersService.findByEmail(email);

    const firstName = user?.firstname ?? null;
    const expiresInSeconds = Number(process.env.AUTH_EMAIL_OTP_EXPIRES_IN ?? 300);
    const expiresInMinutes = Math.max(1, Math.ceil((Number.isFinite(expiresInSeconds) ? expiresInSeconds : 300) / 60));
    const sender = process.env.RESEND_FROM_AUTH_EMAIL ?? 'Lency <no-reply@infos.lency.net>';

    const isPasswordReset = type === 'forget-password';
    const subject = isPasswordReset
        ? 'Reset your password - Lency'
        : 'Verify your email - Lency';

    const reactTemplate = isPasswordReset
        ? ResetPasswordOTP({ firstName, otp, expiresInMinutes })
        : VerifyEmailOTP({ firstName, otp, expiresInMinutes });

    const { error } = await resend.emails.send({
        from: sender,
        to: [email],
        subject,
        react: reactTemplate,
    });

    if (error) {
        console.error('Failed to send auth OTP email:', error.message);
        throw new Error(error.message);
    }
}
