import type { Metadata } from 'next';
import ForgotPasswordForm from './_components/ForgotPasswordForm';

export const metadata: Metadata = {
    title: 'Mot de passe oublié — Lency',
    description: 'Réinitialisez votre mot de passe Lency via un code OTP envoyé par email.',
};

export default function ForgotPasswordPage() {
    return <ForgotPasswordForm />;
}
