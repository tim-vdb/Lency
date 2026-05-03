"use client";

import ResourceCard from "@/front/components/Public/Community/Resources/ResourceCard";
import ResourceFiltersTabs from "@/front/components/Public/Community/Resources/ResourceFiltersTabs";
import { useCategoryBySlug } from "@/front/hooks/queries/use-categories";
import { useResources } from "@/front/hooks/queries/use-resources";
import { useBreadcrumbOverride } from "@/front/hooks/use-breadcrumb-override";

export default function CategoryResourcesPageClient({ slug }: { slug: string }) {
    const { data: category, isPending: categoryPending } = useCategoryBySlug(slug);
    const { data: resources, isPending: resourcesPending } = useResources(category?.id);
    useBreadcrumbOverride(slug, category?.name, "category");

    if (categoryPending) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-neutral-500">Chargement...</p>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-neutral-500">Catégorie introuvable.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <ResourceFiltersTabs activeSlug={slug} />

            {resourcesPending && (
                <p className="text-sm text-neutral-500">Chargement des ressources...</p>
            )}
            {!resourcesPending && resources?.length === 0 && (
                <p className="text-sm text-neutral-500">Aucune ressource dans cette catégorie.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resources?.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} variant="grid" />
                ))}
            </div>
        </div>
    );
}
