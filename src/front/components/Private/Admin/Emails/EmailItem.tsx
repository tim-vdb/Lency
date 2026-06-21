"use client"

import { cn } from "@/front/lib/utils"
import type { AdminEmailListItem } from "@/front/schemas/types/admin-email.type"
import { AdminEmailType } from "@/back/generated/prisma_client"
import { Star, Send, MessageSquare } from "lucide-react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import "dayjs/locale/fr"

dayjs.extend(relativeTime)
dayjs.locale("fr")

type EmailItemProps = {
    email: AdminEmailListItem
    isSelected: boolean
    onClick: () => void
    onStarToggle: () => void
}

export function EmailItem({ email, isSelected, onClick, onStarToggle }: EmailItemProps) {
    const isSent = email.type === AdminEmailType.SENT

    return (
        <div
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onClick()}
            className={cn(
                "w-full text-left px-4 py-3 flex gap-3 items-start border-b border-border/50 transition-colors cursor-pointer",
                isSelected
                    ? "bg-orange/10 border-l-2 border-l-orange"
                    : "hover:bg-muted/50",
                !email.isRead && !isSent && "bg-blue-50/50 dark:bg-blue-950/20"
            )}
        >
            <div className="mt-0.5 shrink-0">
                {isSent ? (
                    <Send className="size-4 text-muted-foreground" />
                ) : (
                    <div className={cn(
                        "size-2 rounded-full mt-1.5",
                        email.isRead ? "bg-transparent" : "bg-blue-500"
                    )} />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className={cn(
                        "text-sm truncate",
                        !email.isRead && !isSent ? "font-semibold" : "font-medium"
                    )}>
                        {isSent ? email.toEmail : (email.fromName ?? email.fromEmail)}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">
                        {dayjs(email.createdAt).fromNow()}
                    </span>
                </div>
                <p className={cn(
                    "text-sm truncate",
                    !email.isRead && !isSent ? "text-foreground font-medium" : "text-muted-foreground"
                )}>
                    {email.subject}
                </p>
                {email._count.replies > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                        <MessageSquare className="size-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{email._count.replies}</span>
                    </div>
                )}
            </div>

            <button
                onClick={(e) => { e.stopPropagation(); onStarToggle() }}
                className="shrink-0 mt-0.5 hover:text-yellow-400 transition-colors"
            >
                <Star className={cn(
                    "size-4",
                    email.isStarred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                )} />
            </button>
        </div>
    )
}
