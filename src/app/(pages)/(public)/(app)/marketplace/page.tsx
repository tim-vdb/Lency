import MarketplacePageClient from "@/front/components/Public/Marketplace/MarketplacePageClient";
import { Suspense } from "react";

export default function MarketplacePage() {
    return (
        <Suspense>
            <MarketplacePageClient />
        </Suspense>
    );
}
