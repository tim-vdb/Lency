import type { Metadata } from 'next';
import MarketplacePageClient from "@/front/components/Public/Marketplace/MarketplacePageClient";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: 'Marketplace — Lency',
    description: 'Trouvez des projets créatifs audiovisuels et proposez vos compétences sur le marketplace Lency.',
};

export default function MarketplacePage() {
    return (
        <Suspense>
            <MarketplacePageClient />
        </Suspense>
    );
}
