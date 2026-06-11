"use client";

import { Trash2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/front/components/ui/button";
import { SheetClose } from "@/front/components/ui/sheet";
import type { DBNotification } from "@/front/queries/notifications";

interface NotificationItemProps {
    notification: DBNotification;
    onDismiss: () => void;
    onOpenResponse: (notif: DBNotification) => void;
    isLoadingApp?: boolean;
}

export function NotificationItem({ notification, onDismiss, onOpenResponse }: NotificationItemProps) {
    const router = useRouter();
    const data = notification.data as Record<string, unknown>;
    const isApplication = notification.type === "new_application" && typeof data?.applicationId === "string";
    const isActionable = notification.type === "project_invitation" || notification.type === "application_status";

    const href = resolveHref(notification.type, data);

    const inner = (
        <>
            <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                    {!notification.read && (
                        <span className="inline-block w-2 h-2 rounded-full bg-orange mr-2 mb-0.5 align-middle" />
                    )}
                    <p className="text-sm font-medium text-black line-clamp-2 inline">
                        {notification.title}
                    </p>
                    <p className="text-xs text-neutral-500 line-clamp-2 mt-1">
                        {notification.description}
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => { e.stopPropagation(); onDismiss(); }}
                >
                    <Trash2 className="w-3 h-3" />
                </Button>
            </div>
            {isApplication && (
                <div className="mt-2 pt-2 border-t border-neutral-100">
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={(e) => { e.stopPropagation(); onOpenResponse(notification); }}
                    >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Répondre à la candidature
                    </Button>
                </div>
            )}
            {isActionable && (
                <div className="mt-2 pt-2 border-t border-neutral-100">
                    <Button
                        size="sm"
                        variant={notification.type === "project_invitation" ? "default" : "outline"}
                        className="h-7 text-xs"
                        onClick={(e) => { e.stopPropagation(); onOpenResponse(notification); }}
                    >
                        {notification.type === "project_invitation" ? "Voir l'invitation" : "Voir les détails"}
                    </Button>
                </div>
            )}
        </>
    );

    const baseClass = `p-3 rounded-lg border transition-colors group cursor-pointer ${
        notification.read
            ? "border-neutral-200 hover:bg-neutral-50"
            : "border-orange bg-neutral-200 hover:bg-neutral-100"
    }`;

    const handleClick = () => {
        if (href) {
            onDismiss();
            router.push(href);
        } else if (isApplication || isActionable) {
            // La modal / le serveur gère le dismiss après action
            onOpenResponse(notification);
        } else {
            onDismiss();
        }
    };

    const card = (
        <div
            role="button"
            tabIndex={0}
            className={`${baseClass} w-full text-left`}
            onClick={handleClick}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClick(); }}
        >
            {inner}
        </div>
    );

    if (href) return <SheetClose asChild>{card}</SheetClose>;
    return card;
}

function resolveHref(type: string, data: Record<string, unknown>): string | null {
    if (type === "category_new_post") {
        const slug = typeof data.categorySlug === "string" ? data.categorySlug : null;
        const postId = typeof data.postId === "string" ? data.postId : null;
        if (slug && postId) return `/community/${slug}/post/${postId}`;
    }
    if (type === "category_new_resource") {
        const slug = typeof data.categorySlug === "string" ? data.categorySlug : null;
        const resourceId = typeof data.resourceId === "string" ? data.resourceId : null;
        if (slug && resourceId) return `/community/${slug}/resources/${resourceId}`;
    }
    if (type === "comment_on_post" || type === "reply_to_comment") {
        const slug = typeof data.postCategorySlug === "string" ? data.postCategorySlug : null;
        const postId = typeof data.postId === "string" ? data.postId : null;
        if (slug && postId) return `/community/${slug}/post/${postId}`;
    }
    if (type === "comment_on_resource" || type === "reply_to_resource_comment") {
        const slug = typeof data.resourceCategorySlug === "string" ? data.resourceCategorySlug : null;
        const resourceId = typeof data.resourceId === "string" ? data.resourceId : null;
        if (slug && resourceId) return `/community/${slug}/resources/${resourceId}`;
    }
    if (type === "comment_on_project") {
        const projectId = typeof data.projectId === "string" ? data.projectId : null;
        if (projectId) return `/marketplace/${projectId}`;
    }
    return null;
}
