import type { Metadata } from 'next';
import { ProjectChatPageClient } from "@/front/components/Public/Marketplace/Projects/ProjectChatPageClient";
import { ProjectsAction } from "@/back/repositories/projects.action";

interface Props {
    params: Promise<{ projectId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { projectId } = await params;
    const project = await ProjectsAction.findById(projectId).catch(() => null);
    if (!project) return { title: 'Chat — Lency' };
    return {
        title: `Chat — ${project.title} — Lency`,
        description: `Messagerie du projet "${project.title}" sur Lency.`,
    };
}

export default async function ProjectChatPage({ params }: Props) {
    const { projectId } = await params;
    return <ProjectChatPageClient projectId={projectId} />;
}
