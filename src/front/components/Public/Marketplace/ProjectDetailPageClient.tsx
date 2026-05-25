"use client";

import { Skeleton } from "@/front/components/ui/skeleton";
import { Separator } from "@/front/components/ui/separator";
import { useProjectById } from "@/front/hooks/queries/use-projects";
import { useBreadcrumbOverride } from "@/front/hooks/use-breadcrumb-override";
import ProjectDetail from "./Projects/ProjectDetail";
import ProjectCard from "./Projects/ProjectCard";
import { useProjects } from "@/front/hooks/queries/use-projects";

function ProjectDetailSkeleton() {
    return (
        <div className="flex flex-col xl:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-5">
                <Skeleton className="w-full h-64 rounded-xl" />
                <div className="flex items-center gap-3">
                    <Skeleton className="w-9 h-9 rounded-full" />
                    <div className="flex flex-col gap-1.5">
                        <Skeleton className="h-3 w-32 rounded-md" />
                        <Skeleton className="h-2.5 w-20 rounded-md" />
                    </div>
                </div>
                <Skeleton className="h-8 w-2/3 rounded-md" />
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-3 w-full rounded-md" />
                    <Skeleton className="h-3 w-full rounded-md" />
                    <Skeleton className="h-3 w-3/4 rounded-md" />
                </div>
                <Separator />
                <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="w-full xl:w-72 shrink-0 flex flex-col gap-4">
                <Skeleton className="h-11 w-full rounded-md" />
                <Skeleton className="h-64 w-full rounded-xl" />
            </div>
        </div>
    );
}

export default function ProjectDetailPageClient({ projectId }: { projectId: string }) {
    const { data: project, isPending } = useProjectById(projectId);
    const { data: allProjects } = useProjects();
    useBreadcrumbOverride(projectId, project?.title);

    const related = allProjects
        ?.filter((p) => p.id !== projectId && p.status === "PUBLISHED")
        .slice(0, 3) ?? [];

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full">
            {isPending && <ProjectDetailSkeleton />}
            {!isPending && !project && (
                <div className="flex items-center justify-center py-24">
                    <p className="text-neutral-500">Projet introuvable.</p>
                </div>
            )}
            {!isPending && project && <ProjectDetail project={project} />}

            {/* Autres projets */}
            {related.length > 0 && (
                <div className="flex flex-col gap-4">
                    <Separator />
                    <p className="text-sm font-semibold text-neutral-700">D&apos;autres projets à découvrir</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {related.map((p) => (
                            <ProjectCard key={p.id} project={p} showProjectType />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
