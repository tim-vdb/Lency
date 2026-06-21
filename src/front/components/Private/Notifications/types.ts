import type { DBNotification } from "@/front/queries/notifications";
import type { ConversationParticipant } from "@/front/lib/api/conversations";

export type TabType = "all" | "projects" | "messages" | "community";

export const PROJECT_NOTIF_TYPES = [
    "new_application", "application_status", "project_message",
    "comment_on_project", "added_to_project", "project_status_changed",
    "project_invitation", "invitation_accepted",
] as const;

export const COMMUNITY_NOTIF_TYPES = [
    "new_follower", "comment_on_post", "reply_to_comment",
    "comment_on_resource", "reply_to_resource_comment",
    "category_new_post", "category_new_resource",
] as const;

export interface ProjectGroup {
    projectId: string;
    projectTitle: string;
    notifications: DBNotification[];
    unreadCount: number;
    latestAt: string;
}

export interface Conversation {
    id: string;
    updatedAt: string;
    participants: ConversationParticipant[];
    messages: Array<{ content: string; senderId: string; createdAt: string }>;
}
