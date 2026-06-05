import type { Metadata } from 'next';
import { Suspense } from 'react';
import OAuthNewUserContent from './_components/OAuthNewUserContent';

export const metadata: Metadata = {
    title: 'Bienvenue sur Lency',
    description: 'Votre compte Lency a été créé avec succès.',
};

export default function OAuthNewUserPage() {
    return (
        <Suspense fallback={null}>
            <OAuthNewUserContent />
        </Suspense>
    );
}
