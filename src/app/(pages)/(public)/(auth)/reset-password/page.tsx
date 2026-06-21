import type { Metadata } from 'next';
import { Suspense } from 'react';
import ResetPasswordContent from './_components/ResetPasswordContent';

export const metadata: Metadata = {
    title: 'Nouveau mot de passe — Lency',
    description: 'Créez un nouveau mot de passe pour votre compte Lency.',
};

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
