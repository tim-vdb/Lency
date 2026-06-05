import type { Metadata } from 'next';
import MarketplaceCategoryPageClient from "@/front/components/Public/Marketplace/MarketplaceCategoryPageClient";

interface Props {
    params: Promise<{ type: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { type } = await params;
    const decoded = decodeURIComponent(type);
    return {
        title: `${decoded} — Marketplace Lency`,
        description: `Parcourez les projets de la catégorie ${decoded} sur le marketplace Lency.`,
    };
}

export default async function MarketplaceCategoryPage({ params }: Props) {
    const { type } = await params;
    const decoded = decodeURIComponent(type);
    return <MarketplaceCategoryPageClient type={decoded} />;
}
