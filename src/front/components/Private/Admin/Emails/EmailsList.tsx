"use client"

import { useAdminEmails, usePatchAdminEmail } from "@/front/queries/admin-emails"
import { EmailItem } from "./EmailItem"
import { AdminEmailBox } from "@/back/generated/prisma_client"
import { Skeleton } from "@/front/components/ui/skeleton"
import { Inbox } from "lucide-react"

type EmailsListProps = {
    box: AdminEmailBox
    selectedId: string | null
    onSelect: (id: string) => void
}

export function EmailsList({ box, selectedId, onSelect }: EmailsListProps) {
    const { data: emails, isLoading } = useAdminEmails(box)
    const { mutate: patch } = usePatchAdminEmail()

    if (isLoading) {
        return (
            <div className="flex flex-col gap-px">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="px-4 py-3 space-y-2 border-b border-border/50">
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                        <Skeleton className="h-3 w-48" />
                    </div>
                ))}
            </div>
        )
    }

    if (!emails || emails.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
                <Inbox className="size-10 opacity-40" />
                <p className="text-sm">Aucun email</p>
            </div>
        )
    }

    const handleSelect = (id: string) => {
        onSelect(id)
        const email = emails.find((e) => e.id === id)
        if (email && !email.isRead) {
            patch({ id, isRead: true })
        }
    }

    return (
        <div className="flex flex-col overflow-y-auto">
            {emails.map((email) => (
                <EmailItem
                    key={email.id}
                    email={email}
                    isSelected={selectedId === email.id}
                    onClick={() => handleSelect(email.id)}
                    onStarToggle={() => patch({ id: email.id, isStarred: !email.isStarred })}
                />
            ))}
        </div>
    )
}
