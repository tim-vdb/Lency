"use client";

import { Settings2, Bell, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "../../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../../ui/sheet";
import { useState } from "react";
import { useNotifications } from "@/front/context/NotificationsContext";
import { useAcceptApplication, useRejectApplication } from "@/front/hooks/queries/use-applications";
import { toast } from "sonner";

type NotificationType = "all" | "projects" | "community" | "map";

export default function NotificationsSheet() {
    const [activeTab, setActiveTab] = useState<NotificationType>("all");
    const { notifications, markAsRead, dismissNotification } = useNotifications();
    const { mutate: accept, isPending: isAccepting } = useAcceptApplication();
    const { mutate: reject, isPending: isRejecting } = useRejectApplication();

    const tabs: { id: NotificationType; label: string }[] = [
        { id: "all", label: "Tous" },
        { id: "projects", label: "Projets" },
        { id: "community", label: "Community" },
        { id: "map", label: "Map" },
    ];

    // Filtrer les notifs par type (pour l'instant on les met toutes dans "projects")
    const filteredNotifications = notifications.filter((n) => {
        if (activeTab === "all") return true;
        if (activeTab === "projects") return n.type === "new_application" || n.type === "application_status";
        return false;
    });

    const hasNotifications = filteredNotifications.length > 0;

    const handleAccept = (applicationId: string) => {
        accept(applicationId, {
            onSuccess: () => {
                toast.success("Candidature acceptée !");
                dismissNotification(applicationId);
            },
            onError: (err) => toast.error(err.message),
        });
    };

    const handleReject = (applicationId: string) => {
        reject(applicationId, {
            onSuccess: () => {
                toast.success("Candidature refusée");
                dismissNotification(applicationId);
            },
            onError: (err) => toast.error(err.message),
        });
    };

    return (
        <SheetContent className="flex flex-col w-full max-w-md">
            {/* ── Header ── */}
            <SheetHeader className='mb-6 space-y-4'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <Bell className="w-5 h-5" />
                        <SheetTitle className='text-lg font-semibold'>Notifications</SheetTitle>
                    </div>
                    <Button variant="ghost" size="icon" className='w-8 h-8'>
                        <Settings2 className="w-4 h-4" />
                    </Button>
                </div>

                {/* ── Onglets ── */}
                <div className='flex gap-0 border-b border-neutral-200'>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-3 px-2 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === tab.id
                                    ? "border-amber-500 text-black"
                                    : "border-transparent text-neutral-500 hover:text-black"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </SheetHeader>

            {/* ── Contenu ── */}
            <div className='flex-1 overflow-y-auto'>
                {!hasNotifications ? (
                    <div className='flex flex-col items-center justify-center h-full py-12 gap-3'>
                        <Bell className="w-12 h-12 text-neutral-200" />
                        <p className='text-sm text-neutral-400'>Aucune notification pour le moment</p>
                    </div>
                ) : (
                    <div className='flex flex-col gap-3'>
                        {filteredNotifications.map((notif) => (
                            <NotificationItem
                                key={notif.id}
                                notification={notif}
                                onDismiss={() => dismissNotification(notif.id)}
                                onAccept={handleAccept}
                                onReject={handleReject}
                                isAccepting={isAccepting}
                                isRejecting={isRejecting}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Footer ── */}
            <div className='border-t border-neutral-200 pt-4'>
                <Button variant="ghost" className='w-full text-sm text-neutral-600 hover:text-black'>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Voir les anciennes notifications
                </Button>
            </div>
        </SheetContent>
    );
}

interface NotificationItemProps {
    notification: {
        id: string;
        type: string;
        title: string;
        description: string;
        timestamp: Date;
        read: boolean;
        data: Record<string, unknown>;
    };
    onDismiss: () => void;
    onAccept: (id: string) => void;
    onReject: (id: string) => void;
    isAccepting: boolean;
    isRejecting: boolean;
}

// Composant pour chaque notification
function NotificationItem({
    notification,
    onDismiss,
    onAccept,
    onReject,
    isAccepting,
    isRejecting,
}: NotificationItemProps) {
    return (
        <div className='p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors group'>
            <div className='flex items-start justify-between gap-2 mb-2'>
                <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-black line-clamp-2'>
                        {notification.title}
                    </p>
                    <p className='text-xs text-neutral-500 line-clamp-2 mt-1'>
                        {notification.description}
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className='w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity'
                    onClick={onDismiss}
                >
                    <Trash2 className="w-3 h-3" />
                </Button>
            </div>

            {/* Actions pour les candidatures */}
            {notification.type === "new_application" && typeof notification.data.applicationId === 'string' && (
                <div className='flex gap-2 mt-3 pt-3 border-t border-neutral-100'>
                    <Button
                        size="sm"
                        variant="default"
                        className='flex-1 h-8 text-xs bg-emerald-600 hover:bg-emerald-700'
                        onClick={() => onAccept(notification.data.applicationId as string)}
                        disabled={isAccepting}
                    >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Accepter
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className='flex-1 h-8 text-xs'
                        onClick={() => onReject(notification.data.applicationId as string)}
                        disabled={isRejecting}
                    >
                        <XCircle className="w-3 h-3 mr-1" />
                        Refuser
                    </Button>
                </div>
            )}
        </div>
    );
}
