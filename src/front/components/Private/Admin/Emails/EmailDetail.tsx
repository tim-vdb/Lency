"use client"

import { useState } from "react"
import { useAdminEmail, useDeleteAdminEmail, usePatchAdminEmail, useReplyAdminEmail } from "@/front/queries/admin-emails"
import { TiptapEditor } from "@/front/components/ui/tiptap-editor"
import { EmailIframe } from "./EmailIframe"
import { Button } from "@/front/components/ui/button"
import { Skeleton } from "@/front/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/front/components/ui/avatar"
import { Separator } from "@/front/components/ui/separator"
import { Badge } from "@/front/components/ui/badge"
import { AdminEmailType } from "@/back/generated/prisma_client"
import { getInitialName } from "@/front/lib/utils"
import {
    Reply,
    Trash2,
    Star,
    ChevronLeft,
    Send,
    MailOpen,
    X,
} from "lucide-react"
import dayjs from "dayjs"
import "dayjs/locale/fr"
import { cn } from "@/front/lib/utils"

dayjs.locale("fr")

type EmailDetailProps = {
    emailId: string
    onBack?: () => void
}

function EmailMessage({
    email,
}: {
    email: {
        id: string
        type: string
        fromEmail: string
        fromName: string | null
        toEmail: string
        subject: string
        htmlContent: string | null
        textContent: string | null
        createdAt: Date
    }
}) {
    const isSent = email.type === AdminEmailType.SENT
    const displayName = isSent ? email.toEmail : (email.fromName ?? email.fromEmail)
    const initials = isSent
        ? email.toEmail.slice(0, 2).toUpperCase()
        : getInitialName({ name: email.fromName ?? email.fromEmail })

    return (
        <div className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                    <Avatar className="size-9 shrink-0">
                        <AvatarFallback className={cn(
                            "text-xs font-semibold",
                            isSent ? "bg-orange/10 text-orange" : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                        )}>
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{displayName}</span>
                            {isSent && (
                                <Badge variant="outline" className="text-xs py-0">
                                    <Send className="size-3 mr-1" /> Envoyé
                                </Badge>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {isSent ? `→ ${email.toEmail}` : email.fromEmail}
                        </p>
                    </div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                    {dayjs(email.createdAt).format("D MMM YYYY, HH:mm")}
                </span>
            </div>

            {email.htmlContent ? (
                <EmailIframe html={email.htmlContent} />
            ) : (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{email.textContent}</p>
            )}
        </div>
    )
}

export function EmailDetail({ emailId, onBack }: EmailDetailProps) {
    const { data: email, isLoading } = useAdminEmail(emailId)
    const { mutate: deleteEmail, isPending: isDeleting } = useDeleteAdminEmail()
    const { mutate: patch } = usePatchAdminEmail()
    const { mutate: reply, isPending: isReplying } = useReplyAdminEmail(emailId)
    const [showReply, setShowReply] = useState(false)
    const [replyHtml, setReplyHtml] = useState("")

    if (isLoading) {
        return (
            <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-48 w-full" />
            </div>
        )
    }

    if (!email) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                <p className="text-sm">Email introuvable</p>
            </div>
        )
    }

    const handleDelete = () => {
        deleteEmail(emailId)
        onBack?.()
    }

    const handleReply = () => {
        if (!replyHtml || replyHtml === "<p></p>") return
        reply({ htmlContent: replyHtml }, {
            onSuccess: () => {
                setReplyHtml("")
                setShowReply(false)
            },
        })
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
                <div className="flex items-center gap-2">
                    {onBack && (
                        <Button size="icon" variant="ghost" className="size-8" onClick={onBack}>
                            <ChevronLeft className="size-4" />
                        </Button>
                    )}
                    <div>
                        <h2 className="text-sm font-semibold line-clamp-1">{email.subject}</h2>
                        <p className="text-xs text-muted-foreground">
                            {email.replies.length} réponse{email.replies.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="size-8"
                        onClick={() => patch({ id: emailId, isRead: !email.isRead })}
                        title={email.isRead ? "Marquer non lu" : "Marquer lu"}
                    >
                        <MailOpen className="size-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="size-8"
                        onClick={() => patch({ id: emailId, isStarred: !email.isStarred })}
                    >
                        <Star className={cn(
                            "size-4",
                            email.isStarred ? "fill-yellow-400 text-yellow-400" : ""
                        )} />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-destructive hover:text-destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            </div>

            {/* Thread */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <EmailMessage email={email} />

                {email.replies.length > 0 && (
                    <>
                        <div className="flex items-center gap-2">
                            <Separator className="flex-1" />
                            <span className="text-xs text-muted-foreground">
                                {email.replies.length} réponse{email.replies.length !== 1 ? "s" : ""}
                            </span>
                            <Separator className="flex-1" />
                        </div>
                        {email.replies.map((r) => (
                            <EmailMessage key={r.id} email={r} />
                        ))}
                    </>
                )}
            </div>

            {/* Reply box */}
            <div className="border-t shrink-0">
                {showReply ? (
                    <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Répondre</span>
                            <Button size="icon" variant="ghost" className="size-7" onClick={() => { setShowReply(false); setReplyHtml("") }}>
                                <X className="size-4" />
                            </Button>
                        </div>
                        <TiptapEditor
                            content={replyHtml}
                            onChange={setReplyHtml}
                            placeholder="Votre réponse..."
                            minHeight="120px"
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => { setShowReply(false); setReplyHtml("") }}>
                                Annuler
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleReply}
                                disabled={isReplying || !replyHtml || replyHtml === "<p></p>"}
                            >
                                <Send className="size-4 mr-2" />
                                {isReplying ? "Envoi..." : "Envoyer"}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="px-6 py-3">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => setShowReply(true)}
                        >
                            <Reply className="size-4" />
                            Répondre
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
