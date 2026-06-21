import type { Metadata } from 'next';
import { notFound } from "next/navigation";
import { ProjectApplicationsPageClient } from "@/front/components/Public/Marketplace/Projects/ProjectApplicationsPageClient";
import { ProjectsAction } from "@/back/repositories/projects.action";

interface Props {
    params: Promise<{ projectId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { projectId } = await params;
    const project = await ProjectsAction.findById(projectId).catch(() => null);
    if (!project) return { title: 'Candidature — Lency' };
    return {
        title: `Candidater — ${project.title} — Lency`,
        description: `Postulez pour rejoindre le projet "${project.title}" sur Lency.`,
    };
}

export default async function ProjectCandidaturePage({ params }: Props) {
    const { projectId } = await params;

    const project = await ProjectsAction.findById(projectId).catch(() => null);
    if (!project) notFound();

    return <ProjectApplicationsPageClient projectId={projectId} />;
}
