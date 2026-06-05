import type { Metadata } from 'next';
import SavedPageClient from './_components/SavedPageClient';

export const metadata: Metadata = {
    title: 'Enregistrés — Lency',
    description: 'Retrouvez vos posts et ressources sauvegardés sur Lency.',
};

export default function SavedPage() {
    return <SavedPageClient />;
}
