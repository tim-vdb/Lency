import type { Metadata } from 'next';
import { notFound } from "next/navigation";
import ResourceDetailPageClient from "@/front/components/Public/Community/Resources/ResourceDetailPageClient";
import { ResourcesService } from "@/back/services/resources.service";

interface Props {
    params: Promise<{ slug: string; resourceId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { resourceId } = await params;
    const resource = await ResourcesService.findByIdResource(resourceId).catch(() => null);
    if (!resource) return { title: 'Ressource introuvable — Lency' };
    return {
        title: `${resource.title} — Lency`,
        description: resource.description ?? `Découvrez la ressource "${resource.title}" partagée sur Lency.`,
    };
}

export default async function ResourceDetailPage({ params }: Props) {
    const { slug, resourceId } = await params;

    const resource = await ResourcesService.findByIdResource(resourceId).catch(() => null);
    if (!resource) notFound();

    return <ResourceDetailPageClient slug={slug} resourceId={resourceId} />;
}
