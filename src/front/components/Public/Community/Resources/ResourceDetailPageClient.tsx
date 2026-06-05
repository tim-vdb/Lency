"use client";

import ResourceCard from "@/front/components/Public/Community/Resources/ResourceCard";
import ResourceDetail from "@/front/components/Public/Community/Resources/ResourceDetail";
import ResourceFiltersTabs from "@/front/components/Public/Community/Resources/ResourceFiltersTabs";
import { Skeleton } from "@/front/components/ui/skeleton";
import { Separator } from "@/front/components/ui/separator";
import { useCategoryBySlug } from "@/front/queries/categories";
import { useResourceById, useResources } from "@/front/queries/resources";
import { useBreadcrumbOverride } from "@/front/hooks/use-breadcrumb-override";

function ResourceDetailSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                <Skeleton className="h-3 w-28 rounded-md" />
                <Skeleton className="h-3 w-16 rounded-md" />
            </div>
            <Skeleton className="w-full h-80 rounded-xl" />
            <div className="flex items-center gap-3">
                <Skeleton className="h-7 w-56 rounded-md" />
                <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-3/4 rounded-md" />
            </div>
            <Skeleton className="h-4 w-48 rounded-md" />
            <Separator />
            <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-6 w-6 rounded-md" />
            </div>
        </div>
    );
}

function SidebarSkeleton() {
    return (
        <>
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border overflow-hidden flex flex-col gap-3 py-3">
                    <Skeleton className="mx-3 h-40 rounded-md" />
                    <div className="px-4 flex flex-col gap-2">
                        <Skeleton className="h-3 w-3/4 rounded-md" />
                        {i % 2 === 0 && <Skeleton className="h-3 w-1/2 rounded-md" />}
                        <div className="flex items-center justify-between pt-1">
                            <Skeleton className="h-4 w-14 rounded-sm" />
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-3 w-8 rounded-md" />
                                <Skeleton className="h-3 w-8 rounded-md" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default function ResourceDetailPageClient({
    slug,
    resourceId,
}: {
    slug: string;
    resourceId: string;
}) {
    const { data: category } = useCategoryBySlug(slug);
    const { data: resource, isPending: resourcePending } = useResourceById(resourceId);
    const { data: siblings, isPending: siblingsPending } = useResources(category?.id);
    useBreadcrumbOverride(slug, category?.name, "category");
    useBreadcrumbOverride(resourceId, resource?.title);

    return (
        <div className="flex flex-col gap-4">
            <ResourceFiltersTabs activeSlug={slug} />

            <div className="block xl:flex gap-4">
                {/* Colonne gauche — stable entre les navigations */}
                <div className="w-1/3 flex-col gap-2 overflow-y-auto pr-1 hidden xl:flex">
                    {siblingsPending
                        ? <SidebarSkeleton />
                        : siblings?.map((r) => (
                            <ResourceCard
                                key={r.id}
                                resource={r}
                                variant="compact"
                                isActive={r.id === resourceId}
                            />
                        ))
                    }
                </div>

                {/* Colonne droite — skeleton uniquement sur ce panneau */}
                <div className="flex-1 min-w-0">
                    {resourcePending && <ResourceDetailSkeleton />}
                    {!resourcePending && !resource && (
                        <p className="text-neutral-500 py-20 text-center">Ressource introuvable.</p>
                    )}
                    {!resourcePending && resource && <ResourceDetail resource={resource} />}
                </div>
            </div>
        </div>
    );
}
