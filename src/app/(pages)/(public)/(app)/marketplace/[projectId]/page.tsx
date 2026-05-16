import ProjectDetailPageClient from "@/front/components/Public/Marketplace/ProjectDetailPageClient";
import BreadcrumbOverride from "@/front/components/Private/Global/BreadcrumbOverride";

interface ProjectPageProps {
    params: Promise<{ projectId: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { projectId } = await params;

    return (
        <>
            <BreadcrumbOverride segment={projectId} label={null} />
            <ProjectDetailPageClient projectId={projectId} />
        </>
    );
}
