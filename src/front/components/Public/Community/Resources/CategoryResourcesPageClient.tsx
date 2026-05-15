"use client";

import ResourceCard from "@/front/components/Public/Community/Resources/ResourceCard";
import ResourceFiltersTabs from "@/front/components/Public/Community/Resources/ResourceFiltersTabs";
import { Badge } from "@/front/components/ui/badge";
import { useCategoryBySlug } from "@/front/hooks/queries/use-categories";
import { useResources } from "@/front/hooks/queries/use-resources";
import { useBreadcrumbOverride } from "@/front/hooks/use-breadcrumb-override";
import { useUser } from "@/front/context/UserContext";
import { Link } from "lucide-react";

export default function CategoryResourcesPageClient({ slug }: { slug: string }) {
    const { data: category, isPending: categoryPending } = useCategoryBySlug(slug);
    const { data: resources, isPending: resourcesPending } = useResources(category?.id);
    const user = useUser();
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
                    <div key={resource.id} className="relative">
                        <ResourceCard resource={resource} variant="grid" />
                        <Badge className="absolute top-3 left-3 bg-black/70 rounded-tl-lg rounded-bl-none rounded-r-sm text-white text-[10px] pointer-events-none">
                            {resource.author.id === user?.id ? (
                                <span>
                                    Par vous
                                </span>
                            ) : resource.author.name ? (
                                <Link href={`/user/${resource.author.username}`}>
                                    Par {resource.author.name}
                                </Link>
                            ) : (
                                <span>Par [Auteur inconnu]</span>
                            )}
                        </Badge>
                    </div>
                ))}
            </div>
        </div>
    );
}
