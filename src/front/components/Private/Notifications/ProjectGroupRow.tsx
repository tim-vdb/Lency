"use client";

import { Trash2, Users, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/front/components/ui/button";
import { SheetClose } from "@/front/components/ui/sheet";
import type { DBNotification } from "@/front/hooks/queries/use-notifications";
import { formatDate } from "./utils";
import type { ProjectGroup } from "./types";

interface ProjectGroupRowProps {
    group: ProjectGroup;
    onDismissGroup: (group: ProjectGroup) => void;
    onDismissNotif: (id: string) => void;
    onOpenResponse: (notif: DBNotification) => void;
    isLoadingApp: boolean;
}

export function ProjectGroupRow({
    group,
    onDismissGroup,
    onDismissNotif,
    onOpenResponse,
    isLoadingApp,
}: ProjectGroupRowProps) {
    const router = useRouter();
    const hasUnread = group.unreadCount > 0;
    const latest = group.notifications[0];
    const pendingApps = group.notifications.filter(n => n.type === "new_application");
    const actionableNotifs = group.notifications.filter(n =>
        n.type === "project_invitation" || n.type === "application_status"
    );
    const pendingInvitation = group.notifications.find(n => n.type === "project_invitation");
    const initial = group.projectTitle.trim().charAt(0).toUpperCase() || "P";

    // Badge : uniquement les messages de chat non lus
    const unreadMessages = group.notifications.filter(n => n.type === "project_message" && !n.read);
    const unreadMsgCount = unreadMessages.length;

    // Image de l'acteur depuis les données de la notif (ex: invitation_accepted)
    const latestData = latest.data as Record<string, unknown>;
    const actorImage = typeof latestData.actorImage === "string" ? latestData.actorImage : null;

    const btnClass = `relative flex items-start gap-3 px-3 py-3 rounded-lg transition-colors text-left w-full cursor-pointer ${hasUnread ? "bg-neutral-50 hover:bg-neutral-100" : "hover:bg-neutral-50"
        }`;

    const previewText = latest.type === "invitation_accepted" ? latest.title : latest.description;

    const AUTO_DISMISS_TYPES = ["project_message", "comment_on_project", "invitation_accepted", "added_to_project"];
    const dismissNavNotifs = () =>
        group.notifications
            .filter(n => AUTO_DISMISS_TYPES.includes(n.type))
            .forEach(n => onDismissNotif(n.id));

    const rowInner = (
        <>
            {/* Avatar */}
            <div className="relative shrink-0 mt-0.5">
                {actorImage ? (
                    <img
                        src={actorImage}
                        alt=""
                        className="h-9 w-9 rounded-full object-cover"
                    />
                ) : (
                    <div className="h-9 w-9 rounded-full bg-neutral-700 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{initial}</span>
                    </div>
                )}
                {unreadMsgCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 rounded-full bg-orange border-2 border-white flex items-center justify-center text-[9px] text-white font-bold px-0.5">
                        {unreadMsgCount > 9 ? "9+" : unreadMsgCount}
                    </span>
                )}
            </div>

            {/* Contenu */}
            <div className="flex-1 min-w-0 pr-6">
                {/* Ligne 1 : titre + date */}
                <div className="flex items-baseline justify-between gap-2 mb-0.5">
                    <p className={`text-sm truncate ${hasUnread ? "font-semibold text-black" : "font-medium text-black"}`}>
                        {group.projectTitle}
                    </p>
                    <span className="text-[11px] text-neutral-400 shrink-0 tabular-nums">
                        {formatDate(group.latestAt)}
                    </span>
                </div>
                {/* Ligne 2 : aperçu du message */}
                <p className={`text-xs line-clamp-2 leading-snug ${hasUnread ? "text-neutral-700" : "text-neutral-500"}`}>
                    {hasUnread && <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange mr-1.5 mb-0.5 align-middle" />}
                    {previewText}
                </p>
            </div>

            {/* Poubelle absolute top-right — hover only */}
            <button
                className="absolute group top-2 right-2 w-6 h-6 cursor-pointer flex items-center justify-center rounded-md opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-neutral-200 text-neutral-400 hover:text-neutral-600"
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); onDismissGroup(group); }}
                aria-label="Supprimer"
            >
                <Trash2 className="w-3.5 h-3.5 cursor-pointer group-hover:text-red-500" />
            </button>
        </>
    );

    return (
        <div className="group/row">
            {pendingInvitation ? (
                // Invitation en attente : ne ferme PAS le sheet, ouvre la modal
                <div role="button" tabIndex={0} className={btnClass} onClick={() => onOpenResponse(pendingInvitation)} onKeyDown={(e) => e.key === "Enter" && onOpenResponse(pendingInvitation)}>
                    {rowInner}
                </div>
            ) : (
                // Sinon : ferme le sheet et navigue vers le projet
                <SheetClose asChild>
                    <div
                        role="button"
                        tabIndex={0}
                        className={btnClass}
                        onClick={() => {
                            dismissNavNotifs();
                            router.push(`/marketplace/${group.projectId}`);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                dismissNavNotifs();
                                router.push(`/marketplace/${group.projectId}`);
                            }
                        }}
                    >
                        {rowInner}
                    </div>
                </SheetClose>
            )}

            {pendingApps.length > 0 && (
                <div className="px-3 pb-2 pt-1 ml-[52px]">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-500 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {pendingApps.length === 1
                                ? (() => {
                                    const d = pendingApps[0].data as Record<string, unknown>;
                                    return typeof d.applicantName === "string" ? d.applicantName : "Candidat";
                                })()
                                : `${pendingApps.length} candidatures en attente`}
                        </span>
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-6 text-xs px-2 ml-auto"
                            onClick={() => onOpenResponse(pendingApps[0])}
                            disabled={isLoadingApp}
                        >
                            {isLoadingApp
                                ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-neutral-400 border-t-transparent" />
                                : "Répondre"}
                        </Button>
                    </div>
                </div>
            )}

            {actionableNotifs.map(n => {
                const isInvitation = n.type === "project_invitation";
                const d = n.data as Record<string, unknown>;
                const label = isInvitation
                    ? `Invitation de ${typeof d.ownerName === "string" ? d.ownerName : "quelqu'un"}`
                    : (d.status === "ACCEPTED" ? "Candidature acceptée ✅" : "Candidature refusée");

                return (
                    <div key={n.id} className="pl-2 pb-2 pt-1">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-neutral-500 flex items-center gap-1 truncate">
                                <Bell className="w-3 h-3 shrink-0" />
                                {label}
                            </span>
                            <Button
                                size="sm"
                                variant={isInvitation ? "default" : "outline"}
                                className="h-6 text-xs px-2 ml-auto shrink-0"
                                onClick={() => onOpenResponse(n)}
                            >
                                {isInvitation ? "Voir" : "Détails"}
                            </Button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
