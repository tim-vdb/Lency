import type { DBNotification } from "@/front/queries/notifications";
import { PROJECT_NOTIF_TYPES, type ProjectGroup } from "./types";

export function groupProjectNotifications(notifications: DBNotification[]): ProjectGroup[] {
    const projectNotifs = notifications.filter(n =>
        (PROJECT_NOTIF_TYPES as readonly string[]).includes(n.type)
    );
    const groups = new Map<string, ProjectGroup>();

    for (const notif of projectNotifs) {
        const d = notif.data as Record<string, unknown>;
        const projectId = typeof d.projectId === "string" ? d.projectId : `_${notif.id}`;
        const projectTitle = typeof d.projectTitle === "string" ? d.projectTitle : "Projet";

        if (!groups.has(projectId)) {
            groups.set(projectId, { projectId, projectTitle, notifications: [], unreadCount: 0, latestAt: notif.createdAt });
        }
        const g = groups.get(projectId)!;
        g.notifications.push(notif);
        if (!notif.read) g.unreadCount++;
        if (notif.createdAt > g.latestAt) g.latestAt = notif.createdAt;
    }

    return Array.from(groups.values()).sort((a, b) => b.latestAt.localeCompare(a.latestAt));
}

export function formatDate(iso: string): string {
    const d = new Date(iso);
    const diffH = Math.floor((Date.now() - d.getTime()) / 3_600_000);
    if (diffH < 1) return "À l'instant";
    if (diffH < 24) return `${diffH}h`;
    const diffD = Math.floor(diffH / 24);
    if (diffD < 7) return `${diffD}j`;
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}
