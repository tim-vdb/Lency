"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/front/components/ui/dialog";
import { Button } from "@/front/components/ui/button";
import { useRespondToInvitation } from "@/front/hooks/queries/use-invitations";
import { useDismissNotification } from "@/front/hooks/queries/use-notifications";
import { CheckCircle2, XCircle, ExternalLink, Briefcase, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { DBNotification } from "@/front/hooks/queries/use-notifications";

interface NotificationDetailModalProps {
    notification: DBNotification | null;
    onClose: () => void;
    onCloseSheet: () => void;
}

export function NotificationDetailModal({ notification, onClose, onCloseSheet }: NotificationDetailModalProps) {
    const router = useRouter();
    const { mutate: respond, isPending } = useRespondToInvitation();
    const { mutate: dismiss } = useDismissNotification();
    const [rejected, setRejected] = useState(false);

    if (!notification) return null;

    const data = notification.data as Record<string, unknown>;
    const type = notification.type;

    function handleClose() {
        setRejected(false);
        onClose();
    }

    // ── Invitation reçue (invited user) ────────────────────────────────────────
    if (type === "project_invitation") {
        const projectTitle = typeof data.projectTitle === "string" ? data.projectTitle : "ce projet";
        const ownerName = typeof data.ownerName === "string" ? data.ownerName : "Quelqu'un";

        function handleAction(action: "accept" | "reject") {
            const invitationId = typeof data.invitationId === "string" ? data.invitationId : null;
            if (!invitationId) return;

            respond({ invitationId, action }, {
                onSuccess: () => {
                    dismiss(notification!.id);
                    if (action === "accept") {
                        const projectId = typeof data.projectId === "string" ? data.projectId : null;
                        handleClose();
                        if (projectId) {
                            onCloseSheet();
                            toast.success("Invitation acceptée ! Bienvenue dans le projet.");
                            router.push(`/marketplace/${projectId}`);
                        }
                    } else {
                        setRejected(true);
                    }
                },
                onError: (err) => toast.error(err.message),
            });
        }

        // Vue "refus confirmé"
        if (rejected) {
            return (
                <Dialog open onOpenChange={(o) => !o && handleClose()}>
                    <DialogContent className="max-w-sm text-center">
                        <div className="flex flex-col items-center gap-3 py-2">
                            <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center">
                                <XCircle className="w-6 h-6 text-neutral-400" />
                            </div>
                            <DialogTitle className="text-base">Invitation refusée</DialogTitle>
                            <DialogDescription className="text-sm text-neutral-500">
                                Vous n&apos;avez pas rejoint <span className="font-medium text-black">«&nbsp;{projectTitle}&nbsp;»</span>.
                                Vous pouvez toujours postuler plus tard si le projet est public.
                            </DialogDescription>
                        </div>
                        <DialogFooter>
                            <Button className="w-full" onClick={handleClose}>Fermer</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            );
        }

        return (
            <Dialog open onOpenChange={(o) => !o && handleClose()}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                                <Briefcase className="w-5 h-5 text-neutral-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-base">Invitation à rejoindre un projet</DialogTitle>
                                <DialogDescription className="text-xs mt-0.5">
                                    {ownerName} vous invite à rejoindre
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <p className="font-semibold text-base text-black px-1">«&nbsp;{projectTitle}&nbsp;»</p>

                    <DialogFooter className="flex gap-2 mt-2">
                        <Button
                            variant="outline"
                            className="flex-1 gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
                            disabled={isPending}
                            onClick={() => handleAction("reject")}
                        >
                            <XCircle className="w-4 h-4" />
                            Refuser
                        </Button>
                        <Button
                            className="flex-1 gap-1.5"
                            disabled={isPending}
                            onClick={() => handleAction("accept")}
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Accepter
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    // ── Statut candidature (applicant) ─────────────────────────────────────────
    if (type === "application_status") {
        const projectTitle = typeof data.projectTitle === "string" ? data.projectTitle : "ce projet";
        const projectId = typeof data.projectId === "string" ? data.projectId : null;
        const status = typeof data.status === "string" ? data.status : null;
        const ownerNote = typeof data.ownerNote === "string" ? data.ownerNote : null;
        const isAccepted = status === "ACCEPTED";

        return (
            <Dialog open onOpenChange={(o) => !o && handleClose()}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-1">
                            <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${isAccepted ? "bg-emerald-50" : "bg-red-50"}`}>
                                {isAccepted
                                    ? <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                    : <XCircle className="w-5 h-5 text-red-500" />
                                }
                            </div>
                            <div>
                                <DialogTitle className="text-base">
                                    {isAccepted ? "Candidature acceptée ✅" : "Candidature non retenue"}
                                </DialogTitle>
                                <DialogDescription className="text-xs mt-0.5">
                                    {projectTitle}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {ownerNote ? (
                        <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
                            <p className="text-xs text-neutral-500 mb-1 font-medium">Message du propriétaire</p>
                            <p className="text-sm text-black">{ownerNote}</p>
                        </div>
                    ) : (
                        <p className="text-sm text-neutral-500 text-center py-1">
                            {isAccepted
                                ? "Bienvenue dans l'équipe ! Vous pouvez maintenant accéder au projet."
                                : "Votre candidature n'a pas été retenue cette fois-ci."}
                        </p>
                    )}

                    <DialogFooter className="flex gap-2 mt-2">
                        <Button variant="outline" className="flex-1" onClick={() => { dismiss(notification.id); handleClose(); }}>
                            Fermer
                        </Button>
                        {isAccepted && projectId && (
                            <Button
                                className="flex-1 gap-1.5"
                                onClick={() => { dismiss(notification.id); handleClose(); onCloseSheet(); router.push(`/marketplace/${projectId}`); }}
                            >
                                <ExternalLink className="w-4 h-4" />
                                Voir le projet
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    // ── Invitation acceptée (owner reçoit cette notif) ──────────────────────────
    if (type === "invitation_accepted") {
        const projectTitle = typeof data.projectTitle === "string" ? data.projectTitle : "votre projet";
        const projectId = typeof data.projectId === "string" ? data.projectId : null;
        const memberName = typeof data.memberName === "string" ? data.memberName : "Un membre";

        return (
            <Dialog open onOpenChange={(o) => !o && handleClose()}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                                <UserCheck className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-base">Nouveau membre !</DialogTitle>
                                <DialogDescription className="text-xs mt-0.5">
                                    {projectTitle}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <p className="text-sm text-neutral-700 px-1">
                        <span className="font-semibold text-black">{memberName}</span> a accepté votre invitation et rejoint votre équipe.
                    </p>

                    <DialogFooter className="flex gap-2 mt-2">
                        <Button variant="outline" className="flex-1" onClick={() => { dismiss(notification.id); handleClose(); }}>
                            Fermer
                        </Button>
                        {projectId && (
                            <Button
                                className="flex-1 gap-1.5"
                                onClick={() => { dismiss(notification.id); handleClose(); onCloseSheet(); router.push(`/marketplace/${projectId}`); }}
                            >
                                <ExternalLink className="w-4 h-4" />
                                Voir le projet
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    return null;
}
