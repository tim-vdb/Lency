"use client";

import ResourceCard from "@/front/components/Public/Community/Resources/ResourceCard";
import ResourceDetail from "@/front/components/Public/Community/Resources/ResourceDetail";
import ResourceFiltersTabs from "@/front/components/Public/Community/Resources/ResourceFiltersTabs";
import { useCategoryBySlug } from "@/front/hooks/querys/use-categories";
import { useResourceById, useResources } from "@/front/hooks/querys/use-resources";

export default function ResourceDetailPageClient({
    slug,
    resourceId,
}: {
    slug: string;
    resourceId: string;
}) {
    const { data: category } = useCategoryBySlug(slug);
    const { data: resource, isPending: resourcePending } = useResourceById(resourceId);
    const { data: siblings } = useResources(category?.id);

    if (resourcePending) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-neutral-500">Chargement...</p>
            </div>
        );
    }

    if (!resource) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-neutral-500">Ressource introuvable.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <ResourceFiltersTabs activeSlug={slug} />

            <div className="flex gap-4">
                <div className="w-1/3 flex flex-col gap-2 max-h-[calc(100vh-10rem)] overflow-y-auto pr-1">
                    {siblings?.map((r) => (
                        <ResourceCard
                            key={r.id}
                            resource={r}
                            variant="compact"
                            isActive={r.id === resourceId}
                        />
                    ))}
                </div>
                <div className="flex-1 min-w-0">
                    <ResourceDetail resource={resource} />
                </div>
            </div>
        </div>
    );
}
