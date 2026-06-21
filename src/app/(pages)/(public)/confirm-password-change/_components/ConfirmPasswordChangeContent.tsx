'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/front/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function ConfirmPasswordChangeContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    async function handleConfirm() {
        if (!token) return;
        setStatus('loading');

        try {
            const res = await fetch('/api/users/confirm-password-change', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });

            if (!res.ok) {
                const { error } = await res.json();
                setErrorMessage(error ?? 'Une erreur est survenue');
                setStatus('error');
                return;
            }

            setStatus('success');
            setTimeout(() => router.push('/account/settings/security'), 2000);
        } catch {
            setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
            setStatus('error');
        }
    }

    if (!token) {
        return (
            <div className="text-center">
                <XCircle className="size-12 text-destructive mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Lien invalide</h2>
                <p className="text-muted-foreground">Ce lien de confirmation est invalide ou a expiré.</p>
                <Button className="mt-6" onClick={() => router.push('/account/settings/security')}>
                    Retour à la sécurité
                </Button>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="text-center">
                <CheckCircle className="size-12 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Mot de passe modifié !</h2>
                <p className="text-muted-foreground">Votre mot de passe a été mis à jour avec succès. Redirection en cours...</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="text-center">
                <XCircle className="size-12 text-destructive mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Erreur</h2>
                <p className="text-muted-foreground">{errorMessage}</p>
                <Button className="mt-6" onClick={() => router.push('/account/settings/security')}>
                    Retour à la sécurité
                </Button>
            </div>
        );
    }

    return (
        <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Confirmer le changement de mot de passe</h2>
            <p className="text-muted-foreground mb-6">
                Cliquez sur le bouton ci-dessous pour valider votre nouveau mot de passe.
            </p>
            <Button onClick={handleConfirm} disabled={status === 'loading'} size="lg">
                {status === 'loading' && <Loader2 className="size-4 animate-spin" />}
                Confirmer le changement de mot de passe
            </Button>
        </div>
    );
}
