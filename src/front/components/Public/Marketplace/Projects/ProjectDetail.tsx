"use client";

import CommentRoot from "@/front/components/Public/Community/Comments/CommentRoot";
import Comments from "@/front/components/Public/Community/Comments/Comments";
import MediaLightbox, { MediaExpandOverlay } from "@/front/components/Public/Community/MediaLightbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/front/components/ui/avatar";
import { Badge } from "@/front/components/ui/badge";
import { Button } from "@/front/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/front/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/front/components/ui/dropdown-menu";
import { Separator } from "@/front/components/ui/separator";
import { useShare } from "@/front/hooks/use-share";
import { cn, getDisplayName, getInitialName, timeAgo } from "@/front/lib/utils";
import { ProjectAttachment, ProjectWithOwner } from "@/front/types/project.schema";
import {
    Briefcase,
    CalendarDays,
    ExternalLink,
    Lock,
    MapPin,
    MessageCircle,
    MoreHorizontal,
    Paperclip,
    Send,
    Users,
    Wallet,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

const REMUNERATION_COLORS: Record<string, string> = {
    "Non rémunéré": "text-rose-600",
    "À discuter": "text-amber-600",
    "Rémunéré": "text-emerald-600",
};

export default function ProjectDetail({ project }: { project: ProjectWithOwner }) {
    const [applyPending, setApplyPending] = useState(false);
    const share = useShare();
    const href = `/marketplace/${project.id}`;

    const roles = Array.isArray(project.roles) ? (project.roles as string[]) : [];
    const attachments = Array.isArray(project.attachments)
        ? (project.attachments as ProjectAttachment[])
        : [];

    function handleApply() {
        setApplyPending(true);
        setTimeout(() => {
            setApplyPending(false);
            toast.success("Candidature envoyée ! Le créateur du projet vous contactera bientôt.");
        }, 800);
    }

    const remunColor = project.remuneration ? (REMUNERATION_COLORS[project.remuneration] ?? "text-neutral-700") : "text-neutral-700";

    return (
        <div className="flex flex-col xl:flex-row gap-6 max-w-6xl mx-auto">
            {/* ── Contenu principal ── */}
            <div className="flex-1 min-w-0 flex flex-col gap-5">
                {/* Banner */}
                {project.bannerUrl ? (
                    <MediaLightbox type="image" src={project.bannerUrl} alt={project.title}>
                        <div className="relative w-full h-64 rounded-xl overflow-hidden bg-neutral-100 group cursor-zoom-in">
                            <Image
                                src={project.bannerUrl}
                                alt={project.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 66vw"
                                className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                                priority
                            />
                            <MediaExpandOverlay />
                        </div>
                    </MediaLightbox>
                ) : (
                    <div className="w-full h-40 rounded-xl bg-linear-to-br from-orange-50 via-pink-50 to-violet-100 flex items-center justify-center">
                        <Briefcase className="w-16 h-16 text-neutral-200" />
                    </div>
                )}

                {/* Header : auteur + date */}
                <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9">
                        <AvatarImage src={project.owner.image ?? undefined} />
                        <AvatarFallback className="text-xs bg-neutral-100">
                            {getInitialName(project.owner)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium truncate">{getDisplayName(project.owner)}</span>
                        <span className="text-xs text-neutral-400">{timeAgo(project.createdAt)}</span>
                    </div>
                </div>

                {/* Titre + badges + menu */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 flex-wrap min-w-0">
                        <h1 className="text-3xl font-bold uppercase leading-tight">{project.title}</h1>
                        {project.visibility !== "PUBLIC" && (
                            <Badge
                                variant="secondary"
                                className={cn(
                                    "shrink-0 flex items-center gap-1 text-xs font-medium",
                                    project.visibility === "PRIVATE"
                                        ? "bg-rose-100 text-rose-700"
                                        : "bg-violet-100 text-violet-700"
                                )}
                            >
                                <Lock className="w-3 h-3" />
                                {project.visibility === "PRIVATE" ? "Privé" : "Membres"}
                            </Badge>
                        )}
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0 w-8 h-8">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => share(href, project.title)}>
                                Partager le projet
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info("Signalement en cours de développement.")}>
                                Signaler
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Description */}
                <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                    {project.description}
                </p>

                {/* Pièces jointes */}
                {attachments.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-semibold">Pièces jointes</p>
                        <div className="flex flex-wrap gap-2">
                            {attachments.map((att, i) => (
                                <a
                                    key={i}
                                    href={att.url}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 bg-neutral-50 text-sm hover:bg-neutral-100 transition-colors"
                                >
                                    <Paperclip className="w-3.5 h-3.5 text-neutral-500" />
                                    {att.name}
                                    <ExternalLink className="w-3 h-3 text-neutral-400" />
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                <Separator />

                {/* Section commentaires */}
                <div className="flex flex-col gap-4">
                    <CommentRoot target={{ type: "project", id: project.id }} />

                    <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-neutral-400" />
                        <p className="text-sm font-semibold text-neutral-700">
                            {project.commentCount} commentaire{project.commentCount !== 1 ? "s" : ""}
                        </p>
                    </div>

                    <Comments target={{ type: "project", id: project.id }} />
                </div>
            </div>

            {/* ── Sidebar ── */}
            <div className="sticky top-0 self-start w-full xl:w-72 shrink-0 flex flex-col gap-4">
                {/* CTA Postuler */}
                <Button
                    size="lg"
                    className="w-full gap-2"
                    onClick={handleApply}
                    disabled={applyPending}
                >
                    <Send className="w-4 h-4" />
                    {applyPending ? "Envoi..." : "Postuler au projet"}
                </Button>

                {/* Infos pratiques */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold">Infos pratiques</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {project.projectType && (
                            <div className="flex flex-col gap-0.5">
                                <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                                    <Briefcase className="w-3.5 h-3.5" />
                                    Type de projet
                                </p>
                                <p className="text-sm font-medium pl-5">{project.projectType}</p>
                            </div>
                        )}

                        {project.mapLocation && (
                            <div className="flex flex-col gap-0.5">
                                <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5" />
                                    Localisation
                                </p>
                                <p className="text-sm font-medium pl-5">{project.mapLocation.name}</p>
                            </div>
                        )}

                        {project.remuneration && (
                            <div className="flex flex-col gap-0.5">
                                <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                                    <Wallet className="w-3.5 h-3.5" />
                                    Rémunération
                                </p>
                                <p className={cn("text-sm font-medium pl-5", remunColor)}>
                                    {project.remuneration}
                                </p>
                            </div>
                        )}

                        {project.startDate && (
                            <div className="flex flex-col gap-0.5">
                                <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                                    <CalendarDays className="w-3.5 h-3.5" />
                                    Début
                                </p>
                                <p className="text-sm font-medium pl-5">
                                    {new Date(project.startDate).toLocaleDateString("fr-FR", {
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                        )}

                        {roles.length > 0 && (
                            <div className="flex flex-col gap-2">
                                <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                                    <Users className="w-3.5 h-3.5" />
                                    Rôles recherchés
                                </p>
                                <div className="flex flex-wrap gap-1.5 pl-5">
                                    {roles.map((role, i) => (
                                        <Badge
                                            key={i}
                                            variant="secondary"
                                            className="text-xs font-normal bg-neutral-100 text-neutral-700"
                                        >
                                            {role}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Aucune info */}
                        {!project.projectType && !project.mapLocation && !project.remuneration && !project.startDate && roles.length === 0 && (
                            <p className="text-xs text-neutral-400 italic">Aucune information renseignée.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Participants */}
                {project.participants.length > 0 && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Participants ({project.participants.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            {project.participants.slice(0, 5).map((p) => (
                                <div key={p.id} className="flex items-center gap-2">
                                    <Avatar className="w-7 h-7">
                                        <AvatarImage src={p.image ?? undefined} />
                                        <AvatarFallback className="text-[10px] bg-neutral-100">
                                            {getInitialName(p)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs text-neutral-600 truncate">{getDisplayName(p)}</span>
                                </div>
                            ))}
                            {project.participants.length > 5 && (
                                <p className="text-xs text-neutral-400 italic">
                                    +{project.participants.length - 5} autre{project.participants.length - 5 > 1 ? "s" : ""}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
