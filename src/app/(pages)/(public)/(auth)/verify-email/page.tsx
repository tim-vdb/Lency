import type { Metadata } from 'next';
import { Suspense } from 'react';
import VerifyEmailContent from './_components/VerifyEmailContent';

export const metadata: Metadata = {
    title: 'Vérification email — Lency',
    description: 'Confirmez votre adresse email pour activer votre compte Lency.',
};

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}
