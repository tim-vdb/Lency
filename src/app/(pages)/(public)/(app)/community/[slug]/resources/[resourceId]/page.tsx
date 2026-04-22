import ResourceDetailPageClient from "@/front/components/Public/Community/Resources/ResourceDetailPageClient";

export default async function ResourceDetailPage({
    params,
}: {
    params: Promise<{ slug: string; resourceId: string }>;
}) {
    const { slug, resourceId } = await params;
    return <ResourceDetailPageClient slug={slug} resourceId={resourceId} />;
}
