import CategoryResourcesPageClient from "@/front/components/Public/Community/Resources/CategoryResourcesPageClient";

export default async function CategoryResourcesPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    return <CategoryResourcesPageClient slug={slug} />;
}
