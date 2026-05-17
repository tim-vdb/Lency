import MarketplaceCategoryPageClient from "@/front/components/Public/Marketplace/MarketplaceCategoryPageClient";

export default async function MarketplaceCategoryPage({
    params,
}: {
    params: Promise<{ type: string }>;
}) {
    const { type } = await params;
    const decoded = decodeURIComponent(type);
    return <MarketplaceCategoryPageClient type={decoded} />;
}
