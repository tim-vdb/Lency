import type { DBNotification } from "@/front/queries/notifications";
import { EmptyState } from "./EmptyState";
import { ProjectGroupRow } from "./ProjectGroupRow";
import type { ProjectGroup } from "./types";

interface ProjectsCompactListProps {
    groups: ProjectGroup[];
    onDismissGroup: (group: ProjectGroup) => void;
    onDismissNotif: (id: string) => void;
    onOpenResponse: (notif: DBNotification) => void;
    isLoadingApp: boolean;
}

export function ProjectsCompactList({
    groups,
    onDismissGroup,
    onDismissNotif,
    onOpenResponse,
    isLoadingApp,
}: ProjectsCompactListProps) {
    if (groups.length === 0) {
        return <EmptyState message="Aucune notification projet" />;
    }

    return (
        <div className="flex flex-col gap-1">
            {groups.map(group => (
                <ProjectGroupRow
                    key={group.projectId}
                    group={group}
                    onDismissGroup={onDismissGroup}
                    onDismissNotif={onDismissNotif}
                    onOpenResponse={onOpenResponse}
                    isLoadingApp={isLoadingApp}
                />
            ))}
        </div>
    );
}
