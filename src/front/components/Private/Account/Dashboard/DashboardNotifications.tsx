"use client";

import React, { useState } from "react";
import { Trash2, ChevronDown, ChevronUp, Bell } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    useNotificationsQuery,
    useDismissNotification,
    notificationQueries,
    type DBNotification,
} from "@/front/queries/notifications";
import { useAcceptApplication, useRejectApplication } from "@/front/queries/applications";
import { fetchApplicationById } from "@/front/lib/api/applications";
import { NotificationItem } from "@/front/components/Private/Notifications/NotificationItem";
import { NotificationDetailModal } from "@/front/components/Private/Notifications/NotificationDetailModal";
import { ApplicationResponseModal, type ApplicationForModal } from "@/front/components/Public/Marketplace/Projects/ApplicationResponseModal";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";
import { cn } from "@/front/lib/utils";

dayjs.extend(relativeTime);
dayjs.locale("fr");

function getDateLabel(dateStr: string): string {
    const d = dayjs(dateStr);
    const today = dayjs().startOf("day");
    const yesterday = today.subtract(1, "day");
    if (d.isAfter(today)) return "Aujourd'hui";
    if (d.isAfter(yesterday)) return "Hier";
    return d.format("D MMM");
}

function groupByDate(notifications: DBNotification[]): { label: string; items: DBNotification[] }[] {
    const map = new Map<string, DBNotification[]>();
    for (const n of notifications) {
        const label = getDateLabel(n.createdAt);
        if (!map.has(label)) map.set(label, []);
        map.get(label)!.push(n);
    }
    return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
}

function DateGroup({
    label,
    items,
    onDismiss,
    onOpenResponse,
    isLoadingApp,
}: {
    label: string;
    items: DBNotification[];
    onDismiss: (id: string) => void;
    onOpenResponse: (notif: DBNotification) => void;
    isLoadingApp: boolean;
}) {
    const [open, setOpen] = useState(true);

    return (
        <div>
            <button
                className="flex items-center gap-1.5 w-full text-left px-3 py-1 cursor-pointer group"
                onClick={() => setOpen((v) => !v)}
            >
                <span className="text-[13px] font-medium text-neutral-500">{label}</span>
                {open ? (
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                ) : (
                    <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
                )}
            </button>

            {open && (
                <div className="flex flex-col gap-1">
                    {items.map((n) => (
                        <NotificationItem
                            key={n.id}
                            notification={n}
                            onDismiss={() => onDismiss(n.id)}
                            onOpenResponse={onOpenResponse}
                            isLoadingApp={isLoadingApp}
                            inSheet={false}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function DashboardNotifications({ className, style }: { className?: string; style?: React.CSSProperties }) {
    const queryClient = useQueryClient();
    const { data: notifications = [], isLoading } = useNotificationsQuery();
    const { mutate: dismiss } = useDismissNotification();
    const { mutate: accept, isPending: isAccepting } = useAcceptApplication();
    const { mutate: reject, isPending: isRejecting } = useRejectApplication();

    const [pendingResponseApp, setPendingResponseApp] = useState<ApplicationForModal | null>(null);
    const [detailNotif, setDetailNotif] = useState<DBNotification | null>(null);

    const invalidate = () =>
        queryClient.invalidateQueries({ queryKey: notificationQueries.list().queryKey });

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
                    configs: full.user.configs ?? [],
                },
            });
        },
        onError: () => toast.error("Impossible de charger la candidature."),
    });

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

    const sorted = [...notifications].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const groups = groupByDate(sorted);

    return (
        <>
            <div className={cn("bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 flex flex-col overflow-hidden", className)} style={style}>
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-700 shrink-0">
                    <h3 className="text-[18px] font-bold text-black dark:text-white">Notifications</h3>
                    {notifications.length > 0 && (
                        <button
                            className="p-1.5 hover:bg-neutral-100 rounded-lg cursor-pointer transition-colors"
                            onClick={() => notifications.forEach((n) => dismiss(n.id))}
                            title="Tout supprimer"
                        >
                            <Trash2 className="w-4 h-4 text-neutral-400 hover:text-red-400" />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto py-2">
                    {isLoading ? (
                        <div className="flex flex-col gap-3 px-3 pt-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <div className="w-10 h-10 rounded-full bg-neutral-100 animate-pulse shrink-0" />
                                    <div className="flex-1 space-y-2 pt-1">
                                        <div className="h-3 bg-neutral-100 rounded animate-pulse w-3/4" />
                                        <div className="h-3 bg-neutral-100 rounded animate-pulse w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : groups.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-neutral-400 py-10">
                            <Bell className="w-9 h-9" />
                            <p className="text-[13px]">Aucune notification</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {groups.map((g) => (
                                <DateGroup
                                    key={g.label}
                                    label={g.label}
                                    items={g.items}
                                    onDismiss={dismiss}
                                    onOpenResponse={handleOpenResponse}
                                    isLoadingApp={isLoadingApp}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <NotificationDetailModal
                notification={detailNotif}
                onClose={() => setDetailNotif(null)}
                onCloseSheet={() => setDetailNotif(null)}
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
