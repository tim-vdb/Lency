"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, ExternalLink, FileText, BookOpen } from "lucide-react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/front/components/ui/dialog";
import { Button } from "@/front/components/ui/button";
import { Textarea } from "@/front/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/front/components/ui/avatar";
import { Badge } from "@/front/components/ui/badge";
import { getDisplayName, getInitialName } from "@/front/lib/utils";
import Link from "next/link";

// Type minimal nécessaire pour le modal
export interface ApplicationUser {
    id: string;
    firstname: string | null;
    lastname: string | null;
    username: string | null;
    image: string | null;
    bio?: string | null;
    portfolio?: string | null;
    cv?: string | null;
    badges?: Array<{ id: string; name: string }>;
    configs?: Array<{ title: string; content: unknown }>;
}

export interface ApplicationForModal {
    id: string;
    applicantNote?: string | null;
    portfolioUrl?: string | null;
    cvUrl?: string | null;
    user: ApplicationUser;
}

interface ApplicationResponseModalProps {
    application: ApplicationForModal | null;
    onAccept: (applicationId: string, ownerNote: string) => void;
    onReject: (applicationId: string, ownerNote: string) => void;
    onClose: () => void;
    isAccepting: boolean;
    isRejecting: boolean;
}

export function ApplicationResponseModal({
    application,
    onAccept,
    onReject,
    onClose,
    isAccepting,
    isRejecting,
}: ApplicationResponseModalProps) {
    const [ownerNote, setOwnerNote] = useState("");

    if (!application) return null;

    const { user } = application;
    const displayName = getDisplayName(user);
    const initials = getInitialName(user);

    // Extraire les rôles depuis UserConfig
    const rolesConfig = user.configs?.find((c) => c.title === "roles");
    const roles: string[] = rolesConfig
        ? ((rolesConfig.content as Record<string, string[]>)?.roles ?? [])
        : [];

    const portfolioLink = application.portfolioUrl || user.portfolio;
    const cvLink = application.cvUrl || user.cv;

    function handleAccept() {
        onAccept(application!.id, ownerNote);
        setOwnerNote("");
    }

    function handleReject() {
        onReject(application!.id, ownerNote);
        setOwnerNote("");
    }

    return (
        <Dialog open={!!application} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Répondre à la candidature</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-1">
                    {/* Profil candidat */}
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50">
                        <Link href={`/user/${user.username}`} target="_blank">
                            <Avatar className="h-12 w-12 shrink-0">
                                <AvatarImage src={user.image ?? undefined} />
                                <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                        </Link>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-black">{displayName}</p>
                            {user.bio && (
                                <p className="text-xs text-neutral-500 line-clamp-2 mt-0.5">{user.bio}</p>
                            )}
                            {roles.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                    {roles.slice(0, 4).map((r) => (
                                        <Badge key={r} variant="secondary" className="text-[10px] px-1.5 py-0">{r}</Badge>
                                    ))}
                                    {roles.length > 4 && (
                                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">+{roles.length - 4}</Badge>
                                    )}
                                </div>
                            )}
                            {user.badges && user.badges.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {user.badges.slice(0, 3).map((b) => (
                                        <span key={b.id} className="text-[10px] text-orange font-medium">🏅 {b.name}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Liens portfolio / CV */}
                    {(portfolioLink || cvLink) && (
                        <div className="flex gap-2">
                            {portfolioLink && (
                                <a href={portfolioLink} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-black border border-neutral-200 rounded px-2 py-1 transition-colors">
                                    <ExternalLink className="w-3 h-3" />Portfolio
                                </a>
                            )}
                            {cvLink && (
                                <a href={cvLink} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-black border border-neutral-200 rounded px-2 py-1 transition-colors">
                                    <FileText className="w-3 h-3" />CV
                                </a>
                            )}
                        </div>
                    )}

                    {application.applicantNote && (
                        <div className="rounded-lg border border-neutral-200 p-3">
                            <p className="text-xs font-medium text-neutral-500 mb-1 flex items-center gap-1">
                                <BookOpen className="w-3 h-3" />
                                <span>Message du candidat</span>
                            </p>
                            <p className="text-sm text-neutral-700 whitespace-pre-wrap">{application.applicantNote}</p>
                        </div>
                    )}

                    <div>
                        <label className="text-sm font-medium text-black block mb-1.5">
                            Votre message au candidat <span className="text-neutral-400 font-normal">(optionnel)</span>
                        </label>
                        <Textarea
                            value={ownerNote}
                            onChange={(e) => setOwnerNote(e.target.value)}
                            placeholder="Ex: Votre profil correspond bien à notre besoin, ou Au revoir et merci pour votre intérêt..."
                            className="resize-none min-h-[80px]"
                            maxLength={500}
                        />
                        <div className="flex justify-end mt-1">
                            <span className="text-xs text-neutral-400">{ownerNote.length}/500</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                        <Button variant="outline" className="flex-1" onClick={onClose}
                            disabled={isAccepting || isRejecting}>
                            Annuler
                        </Button>
                        <Button variant="outline" className="flex-1 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={handleReject} disabled={isAccepting || isRejecting}>
                            <XCircle className="w-4 h-4 mr-1.5" />Refuser
                        </Button>
                        <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                            onClick={handleAccept} disabled={isAccepting || isRejecting}>
                            <CheckCircle2 className="w-4 h-4 mr-1.5" />Accepter
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
