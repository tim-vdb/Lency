import type { DBNotification } from "@/front/queries/notifications";
import type { ConversationParticipant } from "@/front/lib/api/conversations";
import { EmptyState } from "./EmptyState";
import { ConversationsList } from "./ConversationsList";
import { ProjectsCompactList } from "./ProjectsCompactList";
import { NotificationItem } from "./NotificationItem";
import type { Conversation, ProjectGroup } from "./types";

interface AllNotificationsViewProps {
    conversations: Conversation[];
    currentUserId?: string;
    dmNotifications: DBNotification[];
    projectGroups: ProjectGroup[];
    communityNotifs: DBNotification[];
    supportMessages?: DBNotification[];
    onOpenChat: (user: ConversationParticipant) => void;
    onDismissNotif: (id: string) => void;
    onDismissGroup: (group: ProjectGroup) => void;
    onOpenResponse: (notif: DBNotification) => void;
    isLoadingApp: boolean;
}

export function AllNotificationsView({
    conversations,
    currentUserId,
    dmNotifications,
    projectGroups,
    communityNotifs,
    supportMessages = [],
    onOpenChat,
    onDismissNotif,
    onDismissGroup,
    onOpenResponse,
    isLoadingApp,
}: AllNotificationsViewProps) {
    const hasConv = dmNotifications.length > 0;
    const hasProjects = projectGroups.length > 0;
    const hasCommunity = communityNotifs.length > 0;
    const hasSupport = supportMessages.length > 0;
    const sectionCount = [hasConv, hasProjects, hasCommunity, hasSupport].filter(Boolean).length;

    if (sectionCount === 0) return <EmptyState />;

    const showLabels = sectionCount > 1;

    return (
        <div className="flex flex-col gap-5">
            {hasSupport && (
                <section>
                    {showLabels && <SectionLabel>Support</SectionLabel>}
                    <div className="flex flex-col gap-3">
                        {supportMessages.map(n => (
                            <NotificationItem
                                key={n.id}
                                notification={n}
                                onDismiss={() => onDismissNotif(n.id)}
                                onOpenResponse={onOpenResponse}
                            />
                        ))}
                    </div>
                </section>
            )}
            {hasConv && (
                <section>
                    {showLabels && <SectionLabel>Messages</SectionLabel>}
                    <ConversationsList
                        conversations={conversations}
                        currentUserId={currentUserId}
                        dmNotifications={dmNotifications}
                        onOpenChat={onOpenChat}
                        onDismissNotif={onDismissNotif}
                    />
                </section>
            )}
            {hasProjects && (
                <section>
                    {showLabels && <SectionLabel>Projets</SectionLabel>}
                    <ProjectsCompactList
                        groups={projectGroups}
                        onDismissGroup={onDismissGroup}
                        onDismissNotif={onDismissNotif}
                        onOpenResponse={onOpenResponse}
                        isLoadingApp={isLoadingApp}
                    />
                </section>
            )}
            {hasCommunity && (
                <section>
                    {showLabels && <SectionLabel>Communauté</SectionLabel>}
                    <div className="flex flex-col gap-3">
                        {communityNotifs.map(n => (
                            <NotificationItem
                                key={n.id}
                                notification={n}
                                onDismiss={() => onDismissNotif(n.id)}
                                onOpenResponse={onOpenResponse}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2 px-1">
            {children}
        </p>
    );
}
