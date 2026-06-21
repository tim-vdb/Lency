"use client";

import { Button } from "@/front/components/ui/button";
import { Skeleton } from "@/front/components/ui/skeleton";
import { useProjects } from "@/front/queries/projects";
import { Briefcase, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import ProjectCard from "./Projects/ProjectCard";

function ProjectCardSkeleton() {
    return (
        <div className="rounded-xl border border-border overflow-hidden flex flex-col">
            <Skeleton className="w-full h-44" />
            <div className="p-4 flex flex-col gap-3">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-2/3 rounded-md" />
                <div className="flex gap-1 mt-1">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                </div>
            </div>
        </div>
    );
}

export default function MarketplaceCategoryPageClient({ type }: { type: string }) {
    const { data: projects, isPending } = useProjects();

    const filtered = useMemo(() => {
        if (!projects) return [];
        return projects.filter(
            (p) =>
                p.status === "PUBLISHED" &&
                p.projectType?.toLowerCase() === type.toLowerCase()
        );
    }, [projects, type]);

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link
                    href="/marketplace"
                    className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 text-neutral-600" />
                </Link>
                <div>
                    <p className="text-xs text-neutral-500">Marketplace Projets</p>
                    <h1 className="text-2xl font-bold">{type}</h1>
                </div>
            </div>

            {/* Compteur */}
            {!isPending && (
                <p className="text-sm text-neutral-500">
                    {filtered.length} projet{filtered.length !== 1 ? "s" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
                </p>
            )}

            {/* Grille */}
            {isPending ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <ProjectCardSkeleton key={i} />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <div className="p-4 rounded-full bg-neutral-100">
                        <Briefcase className="w-8 h-8 text-neutral-300" />
                    </div>
                    <div className="text-center">
                        <p className="font-semibold text-neutral-700">Aucun projet dans cette communauté</p>
                        <p className="text-sm text-neutral-400 mt-1">Soyez le premier à publier un projet !</p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                        <Link href="/marketplace">Retour au marketplace</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}
        </div>
    );
}
