import { ProjectApplicationsPageClient } from "@/front/components/Public/Marketplace/Projects/ProjectApplicationsPageClient";

interface Props {
    params: Promise<{ projectId: string }>;
}

export default async function ProjectCandidaturePage({ params }: Props) {
    const { projectId } = await params;
    return <ProjectApplicationsPageClient projectId={projectId} />;
}
