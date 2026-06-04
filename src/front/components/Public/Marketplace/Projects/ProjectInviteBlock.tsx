"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Input } from "@/front/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/front/components/ui/avatar";
import { Button } from "@/front/components/ui/button";
import { Badge } from "@/front/components/ui/badge";
import { getDisplayName, getInitialName } from "@/front/lib/utils";
import { useReadyUsers, useSendInvitation, useProjectInvitations } from "@/front/queries/invitations";
import { Search, Send, Clock, CheckCircle, XCircle } from "lucide-react";
import { useDebounce } from "@/front/hooks/use-debounce";

const STATUS_BADGE: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
    PENDING:  { label: "En attente", icon: <Clock className="w-3 h-3" />,       className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    ACCEPTED: { label: "Accepté",    icon: <CheckCircle className="w-3 h-3" />, className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    REJECTED: { label: "Refusé",     icon: <XCircle className="w-3 h-3" />,     className: "bg-red-50 text-red-700 border-red-200" },
};

export function ProjectInviteBlock({ projectId, participantIds }: { projectId: string; participantIds: string[] }) {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 300);
    const [showResults, setShowResults] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const { data: usersData, isFetching } = useReadyUsers(debouncedQuery);
    const { data: invitationsData } = useProjectInvitations(projectId);
    const { mutate: sendInv, isPending: isSending } = useSendInvitation(projectId);

    const users = usersData ?? [];
    const invitations = invitationsData ?? [];
    // Uniquement les invitations en attente dans la liste affichée
    const pendingInvitations = invitations.filter((i) => i.status === "PENDING");
    // Pour bloquer le bouton "Inviter" : toutes les invitations peu importe le statut
    const invitedUserIds = new Set(invitations.map((i) => i.userId));

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setShowResults(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    function handleInvite(userId: string, name: string) {
        sendInv(userId, {
            onSuccess: () => {
                toast.success(`Invitation envoyée à ${name}`);
                setQuery("");
                setShowResults(false);
            },
            onError: (err) => toast.error(err.message),
        });
    }

    return (
        <div className="bg-white rounded-[10px] p-[27px] flex flex-col gap-4">
            <h2 className="font-['Poppins',sans-serif] font-semibold text-[24px] leading-[32px] text-black">
                Inviter des membres
            </h2>
            <div className="w-full h-px bg-[#e8e8e1] rounded-full" />

            <p className="text-sm text-[#8c8a85]">
                Recherchez des talents disponibles (« Prêt à démarrer ») pour les inviter directement.
            </p>

            {/* Barre de recherche */}
            <div ref={wrapperRef} className="relative">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c8a85]" />
                    <Input
                        placeholder="Rechercher un talent…"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
                        onFocus={() => setShowResults(true)}
                        className="pl-9"
                    />
                </div>

                {showResults && (query.length > 0 || users.length > 0) && (
                    <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white border border-[#e8e8e1] rounded-[8px] shadow-lg overflow-hidden max-h-[280px] overflow-y-auto">
                        {isFetching ? (
                            <p className="text-sm text-[#8c8a85] px-4 py-3">Recherche…</p>
                        ) : users.length === 0 ? (
                            <p className="text-sm text-[#8c8a85] px-4 py-3">Aucun talent trouvé.</p>
                        ) : (
                            users.map((user) => {
                                const name = getDisplayName(user);
                                const alreadyMember = participantIds.includes(user.id);
                                const alreadyInvited = invitedUserIds.has(user.id);
                                const disabled = alreadyMember || alreadyInvited || isSending;

                                return (
                                    <div
                                        key={user.id}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors"
                                    >
                                        <Avatar className="w-8 h-8 shrink-0">
                                            <AvatarImage src={user.image ?? user.avatarUrl ?? undefined} />
                                            <AvatarFallback className="text-xs bg-neutral-100">
                                                {getInitialName(user)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-black truncate">{name}</p>
                                            {user.username && (
                                                <p className="text-xs text-[#8c8a85] truncate">@{user.username}</p>
                                            )}
                                        </div>
                                        <Button
                                            size="sm"
                                            variant={alreadyMember || alreadyInvited ? "outline" : "default"}
                                            disabled={disabled}
                                            onClick={() => handleInvite(user.id, name)}
                                            className="shrink-0 gap-1.5 text-xs h-7 px-3"
                                        >
                                            {alreadyMember ? "Membre" : alreadyInvited ? "Invité" : (
                                                <>
                                                    <Send className="w-3 h-3" />
                                                    Inviter
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>

            {/* Invitations en attente uniquement */}
            {pendingInvitations.length > 0 && (
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-medium text-[#8c8a85] uppercase tracking-wide">Invitations envoyées</p>
                    <div className="flex flex-col gap-2">
                        {pendingInvitations.map((inv) => {
                            const badge = STATUS_BADGE[inv.status];
                            return (
                                <div key={inv.id} className="flex items-center gap-3">
                                    <Avatar className="w-7 h-7 shrink-0">
                                        <AvatarImage src={inv.user.image ?? inv.user.avatarUrl ?? undefined} />
                                        <AvatarFallback className="text-xs bg-neutral-100">
                                            {getInitialName(inv.user)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-black flex-1 truncate">{getDisplayName(inv.user)}</span>
                                    <Badge
                                        variant="outline"
                                        className={`flex items-center gap-1 text-[11px] h-5 px-2 ${badge.className}`}
                                    >
                                        {badge.icon}
                                        {badge.label}
                                    </Badge>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
