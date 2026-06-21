"use client";

import { Settings2 } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/front/components/ui/button";
import { SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/front/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/front/components/ui/tooltip";
import {
    useNotificationsQuery,
    useDismissNotification,
    notificationQueries,
    type DBNotification,
} from "@/front/queries/notifications";
import { useAcceptApplication, useRejectApplication } from "@/front/queries/applications";
import { useConversations } from "@/front/queries/conversations";
import { useUser } from "@/front/states/contexts/user.context";
import { useNotifPreferences } from "@/front/queries/notif-preferences";
import { fetchApplicationById } from "@/front/lib/api/applications";
import type { ConversationParticipant } from "@/front/lib/api/conversations";
import { DirectMessageChat } from "@/front/components/Private/Chat/DirectMessageChat";
import { ApplicationResponseModal, type ApplicationForModal } from "@/front/components/Public/Marketplace/Projects/ApplicationResponseModal";
import { AllNotificationsView } from "./AllNotificationsView";
import { ConversationsList } from "./ConversationsList";
import { ProjectsCompactList } from "./ProjectsCompactList";
import { NotificationItem } from "./NotificationItem";
import { NotificationDetailModal } from "./NotificationDetailModal";
import { EmptyState } from "./EmptyState";
import { groupProjectNotifications } from "./utils";
import { COMMUNITY_NOTIF_TYPES, type TabType } from "./types";

const ALL_TABS: { id: TabType; label: string; prefKey: "show_projects" | "show_messages" | "show_community" | null }[] = [
    { id: "all", label: "Tous", prefKey: null },
    { id: "projects", label: "Projets", prefKey: "show_projects" },
    { id: "messages", label: "Messages", prefKey: "show_messages" },
    { id: "community", label: "Communauté", prefKey: "show_community" },
];

export default function NotificationsSheet() {
    const [activeTab, setActiveTab] = useState<TabType>("all");
    const [openDMUser, setOpenDMUser] = useState<ConversationParticipant | null>(null);
    const [pendingResponseApp, setPendingResponseApp] = useState<ApplicationForModal | null>(null);
    const [detailNotif, setDetailNotif] = useState<DBNotification | null>(null);
    const closeSheetRef = useRef<HTMLButtonElement>(null);

    const { data: notifications = [], isLoading } = useNotificationsQuery();
    const { mutate: dismiss } = useDismissNotification();
    const { mutate: accept, isPending: isAccepting } = useAcceptApplication();
    const { mutate: reject, isPending: isRejecting } = useRejectApplication();
    const { data: conversations = [], isLoading: isLoadingConv } = useConversations();
    const currentUser = useUser();
    const queryClient = useQueryClient();
    const { prefs } = useNotifPreferences();

    const visibleTabs = ALL_TABS.filter(tab =>
        tab.prefKey === null || prefs[tab.prefKey]
    );

    const { mutate: loadApplication, isPending: isLoadingApp } = useMutation({
        mutationFn: (applicationId: string) => fetchApplicationById(applicationId),
        onSuccess: (full) => {
            setPendingResponseApp({
                id: full.id,
                applicantNote: full.applicantNote ?? null,
                portfolioUrl: full.portfolioUrl ?? null,
                cvUrl: full.cvUrl ?? null,
                user: {
                    id: full.user.id,
                    firstname: full.user.firstname ?? null,
                    lastname: full.user.lastname ?? null,
                    username: full.user.username ?? null,
                    image: full.user.image ?? null,
                    bio: full.user.bio ?? null,
                    portfolio: full.user.portfolio ?? null,
                    cv: full.user.cv ?? null,
                    badges: full.user.badges ?? [],
                    configs: full.user.configs ?? [],
                },
            });
        },
        onError: () => toast.error("Impossible de charger la candidature."),
    });

    const invalidate = () =>
        queryClient.invalidateQueries({ queryKey: notificationQueries.list().queryKey });

    const handleAccept = (applicationId: string, ownerNote: string) => {
        accept({ applicationId, ownerNote }, {
            onSuccess: () => {
                toast.success("Candidature acceptée !");
                invalidate();
                setPendingResponseApp(null);
            },
            onError: (err) => toast.error(err.message),
        });
    };

    const handleReject = (applicationId: string, ownerNote: string) => {
        reject({ applicationId, ownerNote }, {
            onSuccess: () => {
                toast.success("Candidature refusée");
                invalidate();
                setPendingResponseApp(null);
            },
            onError: (err) => toast.error(err.message),
        });
    };

    const handleOpenResponse = (notif: DBNotification) => {
        if (
            notif.type === "project_invitation" ||
            notif.type === "application_status" ||
            notif.type === "invitation_accepted"
        ) {
            setDetailNotif(notif);
            return;
        }
        const d = notif.data as Record<string, unknown>;
        const applicationId = typeof d.applicationId === "string" ? d.applicationId : null;
        if (applicationId) loadApplication(applicationId);
    };

    const communityNotifs = notifications.filter(n =>
        (COMMUNITY_NOTIF_TYPES as readonly string[]).includes(n.type)
    );
    const projectGroups = groupProjectNotifications(notifications);
    const dmNotifications = notifications.filter(n => n.type === "dm_message" && !n.read);
    const supportMessages = notifications.filter(n => n.type === "support_message" && !n.read);

    const actionProps = { onOpenResponse: handleOpenResponse, isLoadingApp };

    const renderContent = () => {
        if (activeTab === "messages") {
            if (!prefs.show_messages) return <EmptyState />;
            if (isLoadingConv) return <Spinner />;
            return (
                <div className="flex flex-col gap-4">
                    {supportMessages.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-2 px-2">SUPPORT</p>
                            <div className="flex flex-col gap-2">
                                {supportMessages.map(n => (
                                    <NotificationItem
                                        key={n.id}
                                        notification={n}
                                        onDismiss={() => dismiss(n.id)}
                                        {...actionProps}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    {(conversations.length > 0 || dmNotifications.length > 0) && (
                        <div>
                            {supportMessages.length > 0 && <p className="text-xs font-semibold text-muted-foreground mb-2 px-2">MESSAGES DIRECTS</p>}
                            <ConversationsList
                                conversations={conversations}
                                currentUserId={currentUser?.id}
                                dmNotifications={dmNotifications}
                                onOpenChat={setOpenDMUser}
                                onDismissNotif={dismiss}
                            />
                        </div>
                    )}
                    {supportMessages.length === 0 && conversations.length === 0 && <EmptyState />}
                </div>
            );
        }

        if (activeTab === "projects") {
            if (!prefs.show_projects) return <EmptyState />;
            if (isLoading) return <Spinner />;
            return (
                <ProjectsCompactList
                    groups={projectGroups}
                    onDismissGroup={(group) => group.notifications.forEach(n => dismiss(n.id))}
                    onDismissNotif={dismiss}
                    {...actionProps}
                />
            );
        }

        if (activeTab === "community") {
            if (!prefs.show_community) return <EmptyState />;
            if (isLoading) return <Spinner />;
            if (communityNotifs.length === 0) return <EmptyState />;
            return (
                <div className="flex flex-col gap-3">
                    {communityNotifs.map(n => (
                        <NotificationItem
                            key={n.id}
                            notification={n}
                            onDismiss={() => dismiss(n.id)}
                            {...actionProps}
                        />
                    ))}
                </div>
            );
        }

        if (isLoading || isLoadingConv) return <Spinner />;
        return (
            <AllNotificationsView
                conversations={conversations}
                currentUserId={currentUser?.id}
                dmNotifications={dmNotifications}
                projectGroups={prefs.show_projects ? projectGroups : []}
                communityNotifs={prefs.show_community ? communityNotifs : []}
                supportMessages={supportMessages}
                onOpenChat={prefs.show_messages ? setOpenDMUser : () => {}}
                onDismissNotif={dismiss}
                onDismissGroup={(group) => group.notifications.forEach(n => dismiss(n.id))}
                {...actionProps}
            />
        );
    };

    return (
        <>
            <SheetContent className="flex flex-col w-full max-w-md bg-background border-l border-border shadow-2xl p-0">
                {/* Header */}
                <div className="px-6 pt-6 pb-0 border-b border-border">
                    <SheetHeader className="mb-0 space-y-0">
                        <div className="flex items-center gap-3 mb-4 pr-8">
                            <SheetTitle className="text-base font-semibold tracking-tight flex-1">
                                Notifications
                            </SheetTitle>
                            <TooltipProvider delayDuration={300}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0"
                                            asChild
                                        >
                                            <Link href="/account/settings/notifs">
                                                <Settings2 className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">
                                        Paramètres des notifications
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-0">
                            {visibleTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 py-2.5 px-2 text-xs font-medium border-b-2 transition-colors ${
                                        activeTab === tab.id
                                            ? "border-foreground text-foreground"
                                            : "border-transparent text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </SheetHeader>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {renderContent()}
                </div>
            </SheetContent>

            {openDMUser && (
                <DirectMessageChat otherUser={openDMUser} onClose={() => setOpenDMUser(null)} />
            )}

            <SheetClose ref={closeSheetRef} asChild>
                <button className="hidden" aria-hidden tabIndex={-1} />
            </SheetClose>

            <NotificationDetailModal
                notification={detailNotif}
                onClose={() => setDetailNotif(null)}
                onCloseSheet={() => closeSheetRef.current?.click()}
            />

            <ApplicationResponseModal
                application={pendingResponseApp}
                onAccept={handleAccept}
                onReject={handleReject}
                onClose={() => setPendingResponseApp(null)}
                isAccepting={isAccepting}
                isRejecting={isRejecting}
            />
        </>
    );
}

function Spinner() {
    return (
        <div className="flex items-center justify-center h-full py-12">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted border-t-foreground" />
        </div>
    );
}
