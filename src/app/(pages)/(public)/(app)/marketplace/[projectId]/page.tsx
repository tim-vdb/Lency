import { notFound, redirect } from "next/navigation";
import { getUser } from "@/back/lib/auth-session";
import { ProjectsAction } from "@/back/repositories/projects.action";
import ProjectDetailPageClient from "@/front/components/Public/Marketplace/ProjectDetailPageClient";

interface ProjectPageProps {
    params: Promise<{ projectId: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { projectId } = await params;

    const project = await ProjectsAction.findById(projectId);
    if (!project) return notFound();

    if (project.visibility === "PRIVATE") {
        const user = await getUser();
        if (!user) redirect("/auth/sign-in");
        const isMember =
            project.ownerId === user.id ||
            project.participants.some((p) => p.id === user.id);
        if (!isMember) redirect("/marketplace");
    }

    return <ProjectDetailPageClient projectId={projectId} />;
}
