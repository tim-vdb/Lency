import type { Metadata } from 'next';
import CommunityResourcesPageClient from './_components/CommunityResourcesPageClient';

export const metadata: Metadata = {
    title: 'Ressources — Communauté Lency',
    description: 'Explorez les ressources partagées par la communauté Lency : tutoriels, outils, inspirations pour les créatifs audiovisuels.',
};

export default function CommunityResourcesPage() {
    return <CommunityResourcesPageClient />;
}
