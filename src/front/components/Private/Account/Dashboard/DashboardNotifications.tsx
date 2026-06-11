"use client";

import React, { useState } from "react";
import { Trash2, ChevronDown, ChevronUp, Bell } from "lucide-react";
import { useNotificationsQuery, useDismissNotification } from "@/front/queries/notifications";
import type { DBNotification } from "@/front/queries/notifications";
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

// Extrait author + communauté selon le type de notification
function parseNotifContent(n: DBNotification): { author: string | null; action: string; bold: string | null } {
    const data = n.data as Record<string, unknown>;
    const categoryName = typeof data.categoryName === "string" ? data.categoryName : null;
    const projectTitle = typeof data.projectTitle === "string" ? data.projectTitle : null;

    // Extrait le nom d'auteur depuis description "AuthorName a publié un ..."
    const authorMatch = n.description.match(/^(.+?) a /);
    const author = authorMatch ? authorMatch[1] : null;

    if (n.type === "category_new_post" && author && categoryName) {
        return { author, action: "à poster sur", bold: categoryName };
    }
    if (n.type === "category_new_resource" && author && categoryName) {
        return { author, action: "à publié une ressource sur", bold: categoryName };
    }
    if ((n.type === "comment_on_post" || n.type === "reply_to_comment") && author) {
        return { author, action: "a commenté", bold: projectTitle ?? categoryName };
    }
    if (n.type === "new_application" && author) {
        return { author, action: "a candidaté sur", bold: projectTitle };
    }

    return { author: null, action: n.title, bold: null };
}

function NotifAvatar({ notification }: { notification: DBNotification }) {
    const data = notification.data as Record<string, unknown>;
    const authorAvatar = typeof data.authorAvatar === "string" ? data.authorAvatar : null;

    // Initiales depuis description ou titre
    const { author } = parseNotifContent(notification);
    const initials = author ? author.slice(0, 2).toUpperCase() : "??";

    return (
        <div className="w-10 h-10 rounded-full bg-neutral-200 shrink-0 overflow-hidden flex items-center justify-center text-xs font-semibold text-neutral-600">
            {authorAvatar ? (
                <img src={authorAvatar} alt="" className="w-full h-full object-cover" />
            ) : (
                initials
            )}
        </div>
    );
}

function NotifItem({ notification, onDismiss }: { notification: DBNotification; onDismiss: () => void }) {
    const { author, action, bold } = parseNotifContent(notification);
    const timeAgo = dayjs(notification.createdAt).fromNow(true);

    return (
        <div className={cn(
            "flex items-start gap-3 px-3 py-3 rounded-lg transition-colors group cursor-pointer hover:bg-neutral-50",
            !notification.read && "bg-neutral-50"
        )}>
            <NotifAvatar notification={notification} />

            <div className="flex-1 min-w-0">
                <p className="text-[13px] text-neutral-700 leading-5">
                    {author && (
                        <>
                            <span>{author} </span>
                            <span className="text-neutral-500">{action} </span>
                        </>
                    )}
                    {bold ? (
                        <span className="font-semibold text-black">{bold}</span>
                    ) : (
                        !author && <span>{action}</span>
                    )}
                </p>
            </div>

            {/* Temps + delete */}
            <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[11px] text-neutral-400">{timeAgo}</span>
                <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); onDismiss(); }}
                >
                    <Trash2 className="w-3 h-3 text-neutral-400 hover:text-red-400" />
                </button>
            </div>
        </div>
    );
}

function DateGroup({
    label,
    items,
    onDismiss,
}: {
    label: string;
    items: DBNotification[];
    onDismiss: (id: string) => void;
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
                <div className="flex flex-col">
                    {items.map((n) => (
                        <NotifItem key={n.id} notification={n} onDismiss={() => onDismiss(n.id)} />
                    ))}
                </div>
            )}
        </div>
    );
}

export function DashboardNotifications({ className, style }: { className?: string; style?: React.CSSProperties }) {
    const { data: notifications = [], isLoading } = useNotificationsQuery();
    const { mutate: dismiss } = useDismissNotification();

    const sorted = [...notifications].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const groups = groupByDate(sorted);

    return (
        <div className={cn("bg-white rounded-xl border border-neutral-200 flex flex-col overflow-hidden", className)} style={style}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 shrink-0">
                <h3 className="text-[18px] font-bold text-black">Notifications</h3>
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
                            <DateGroup key={g.label} label={g.label} items={g.items} onDismiss={dismiss} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
