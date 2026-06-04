"use client"

import ResourceCard from "@/front/components/Public/Community/Resources/ResourceCard";
import { Badge } from "@/front/components/ui/badge";
import { Skeleton } from "@/front/components/ui/skeleton";
import { useUser } from "@/front/context/UserContext";
import { useResources } from "@/front/hooks/queries/use-resources";
import Link from "next/link";
import { cn } from "@/front/lib/utils";

function ResourceListSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border overflow-hidden flex flex-col gap-3 py-3">
                    <Skeleton className="mx-3 h-40 rounded-md" />
                    <div className="px-4 flex flex-col gap-2">
                        <Skeleton className="h-3 w-3/4 rounded-md" />
                        <Skeleton className="h-3 w-1/2 rounded-md" />
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
        </div>
    );
}

export default function CommunityResourcesPage() {
    const { data: resources, isPending } = useResources();
    const user = useUser();

    return (
        <div className="max-w-5xl mx-auto flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold">Ressources</h1>
                <p className="text-sm text-neutral-500">Toutes les ressources de la communauté</p>
            </div>

            {isPending && <ResourceListSkeleton />}
            {!isPending && resources?.length === 0 && (
                <p className="text-neutral-500 text-sm">Aucune ressource disponible.</p>
            )}
            {resources && resources.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {resources.map((resource, idx) => (
                        <div key={idx} className="relative">
                            <ResourceCard resource={resource} variant="grid" />
                            {(() => {
                                const isLinkable = resource.author.id !== user?.id && !!resource.author.username;
                                return (
                                    <Badge className={cn(
                                        "absolute top-0 left-0 bg-black/70 rounded-tl-lg rounded-bl-none rounded-r-sm text-white text-[10px] transition-colors",
                                        isLinkable ? "hover:bg-black/40 cursor-pointer" : "pointer-events-none"
                                    )}>
                                        {resource.author.id === user?.id ? (
                                            <span>Par vous</span>
                                        ) : resource.author.username ? (
                                            <Link
                                                href={`/user/${resource.author.username}`}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Par {resource.author.name ?? resource.author.username}
                                            </Link>
                                        ) : (
                                            <span>Par [Auteur inconnu]</span>
                                        )}
                                    </Badge>
                                );
                            })()}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
