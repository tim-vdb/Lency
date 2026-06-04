import { ProjectChatPageClient } from "@/front/components/Public/Marketplace/Projects/ProjectChatPageClient";

interface Props {
    params: Promise<{ projectId: string }>;
}

export default async function ProjectChatPage({ params }: Props) {
    const { projectId } = await params;
    return <ProjectChatPageClient projectId={projectId} />;
}
