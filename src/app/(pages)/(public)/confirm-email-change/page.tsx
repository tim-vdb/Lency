import type { Metadata } from 'next';
import { Suspense } from 'react';
import ConfirmEmailChangeContent from './_components/ConfirmEmailChangeContent';

export const metadata: Metadata = {
    title: 'Confirmer le changement d\'email — Lency',
};

export default function ConfirmEmailChangePage() {
    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-5rem)]">
            <div className="bg-white dark:bg-zinc-900 border border-border rounded-2xl p-10 w-full max-w-md shadow-lg">
                <Suspense fallback={<div>Chargement...</div>}>
                    <ConfirmEmailChangeContent />
                </Suspense>
            </div>
        </div>
    );
}
