import { ProjectSkeleton } from "@/front/components/Public/Marketplace/Skeletons";

export default function MarketplaceLoading() {
    return (
        <div className="flex flex-col gap-10">
            <ProjectSkeleton label="Projets" />
            <ProjectSkeleton label="Talents" />
        </div>
    );
}
