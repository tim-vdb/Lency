import CategoryPageClient from "@/front/components/Public/Community/Category/CategoryPageClient";

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    return <CategoryPageClient slug={slug} />;
}
