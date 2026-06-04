"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Users } from "lucide-react";
import { Button } from "@/front/components/ui/button";
import { ProjectChat } from "@/front/components/Private/Chat/ProjectChat";
import { useProjectById } from "@/front/hooks/queries/use-projects";
import { useUser } from "@/front/context/UserContext";

interface Props { projectId: string }

export function ProjectChatPageClient({ projectId }: Props) {
    const router = useRouter();
    const currentUser = useUser();
    const { data: project, isLoading } = useProjectById(projectId);

    const isOwner = project?.ownerId === currentUser?.id;
    const isParticipant = project?.participants?.some((p: { id: string }) => p.id === currentUser?.id) ?? false;
    const isMember = isOwner || isParticipant;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="text-center py-16 text-neutral-400 text-sm">
                Projet introuvable.
            </div>
        );
    }

    if (!isMember) {
        return (
            <div className="text-center py-16 text-neutral-400 text-sm">
                Accès réservé aux membres du projet.
            </div>
        );
    }

    const memberCount = (project.participants?.length ?? 0) + 1;

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-4">
            {/* En-tête */}
            <div className="flex items-center gap-3 bg-white border border-neutral-200 rounded-xl px-3 py-2.5 shadow-sm">
                <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                    onClick={() => router.push(`/marketplace/${projectId}`)}
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 truncate leading-tight">{project.title}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                        <Users className="w-3 h-3 text-neutral-400" />
                        <span className="text-xs text-neutral-400">
                            {memberCount} membre{memberCount !== 1 ? "s" : ""}
                        </span>
                    </div>
                </div>
            </div>

            {/* Chat complet */}
            <div className="min-h-[70vh] rounded-xl overflow-hidden border border-neutral-200 bg-white">
                <ProjectChat projectId={projectId} />
            </div>
        </div>
    );
}
