import type { Metadata } from 'next';
import CommunityPageClient from './_components/CommunityPageClient';

export const metadata: Metadata = {
    title: 'Communauté — Lency',
    description: 'Découvrez les posts de la communauté créative Lency : images, vidéos, audio et textes partagés par les créatifs.',
};

export default function CommunityPage() {
    return <CommunityPageClient />;
}
