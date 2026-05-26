"use client";

import { EditProjectForm } from "@/front/components/Private/Global/EditProjectForm";
import CommentRoot from "@/front/components/Public/Community/Comments/CommentRoot";
import Comments from "@/front/components/Public/Community/Comments/Comments";
import MediaLightbox, { MediaExpandOverlay } from "@/front/components/Public/Community/MediaLightbox";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/front/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/front/components/ui/avatar";
import { Button } from "@/front/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
} from "@/front/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/front/components/ui/dropdown-menu";
import { useUser } from "@/front/context/UserContext";
import { useDeleteProject, useReportProject } from "@/front/hooks/queries/use-projects";
import { useApplyToProject } from "@/front/hooks/queries/use-applications";
import { useShare } from "@/front/hooks/use-share";
import { cn, getDisplayName, getInitialName, timeAgo } from "@/front/lib/utils";
import { ProjectAttachment, ProjectWithOwner } from "@/front/types/project.schema";
import {
    Briefcase,
    CalendarDays,
    ExternalLink,
    GraduationCap,
    MapPin,
    MessageCircle,
    MessageCircleMore,
    MoreHorizontal,
    Pencil,
    Wallet
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const LEVEL_LABEL: Record<string, string> = {
    DEBUTANT: "Débutant",
    INTERMEDIAIRE: "Intermédiaire",
    AVANCE: "Avancé",
};

const WORKMODE_LABEL: Record<string, string> = {
    PRESENTIEL: "Présentiel",
    DISTANCIEL: "Distanciel",
    HYBRIDE: "Hybride",
};

const REMUNERATION_LABEL: Record<string, { label: string; color: string }> = {
    NON_REMUNERE: { label: "Non rémunéré", color: "text-[#4c4a43]" },
    REMUNERE: { label: "Rémunéré", color: "text-emerald-600" },
};

export default function ProjectDetail({ project }: { project: ProjectWithOwner }) {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const share = useShare();
    const router = useRouter();
    const currentUser = useUser();
    const isOwner = currentUser?.id === project.ownerId;
    const href = `/marketplace/${project.id}`;
    const { mutate: report, isPending: isReporting } = useReportProject(project.id);
    const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();
    const { mutate: apply, isPending: isApplying } = useApplyToProject(project.id);

    const roles = Array.isArray(project.roles) ? (project.roles as string[]) : [];
    const attachments = Array.isArray(project.attachments)
        ? (project.attachments as ProjectAttachment[])
        : [];

    function handleApply() {
        apply(undefined, {
            onSuccess: () => {
                toast.success("Candidature envoyée ! Le créateur du projet vous contactera bientôt.");
            },
            onError: (err) => {
                toast.error(err.message);
            },
        });
    }

    const remuInfo = project.remunerationType ? REMUNERATION_LABEL[project.remunerationType] : null;
    const levelStr = project.level ? LEVEL_LABEL[project.level] : null;
    const workModeStr = project.workMode ? WORKMODE_LABEL[project.workMode] : null;

    const hasInfos = !!(project.projectType || project.mapLocation || workModeStr || remuInfo || levelStr || project.startDate || roles.length > 0);

    return (
        <>
            <div className="flex flex-col gap-0">
                {/* Bannière pleine largeur */}
                {project.bannerUrl ? (
                    <MediaLightbox type="image" src={project.bannerUrl} alt={project.title}>
                        <div className="relative w-full h-[300px] rounded-xl overflow-hidden bg-neutral-100 group cursor-zoom-in mb-0">
                            <Image
                                src={project.bannerUrl}
                                alt={project.title}
                                fill
                                sizes="(max-width: 1440px) 100vw, 1440px"
                                className="object-cover"
                                priority
                            />
                            <MediaExpandOverlay />
                        </div>
                    </MediaLightbox>
                ) : (
                    <div className="w-full h-[300px] rounded-[8px] bg-gradient-to-br from-orange-50 via-pink-50 to-violet-100 flex items-center justify-center mb-0">
                        <Briefcase className="w-16 h-16 text-neutral-200" />
                    </div>
                )}

                {/* Grid 2 colonnes */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 items-start mt-6">
                    {/* Colonne gauche */}
                    <div className="bg-white rounded-[10px] p-[55px] flex flex-col gap-6 min-w-0">
                        {/* Titre + badge visibilité + menu */}
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3 flex-wrap min-w-0">
                                <h1 className="font-['Poppins',sans-serif] font-bold text-[30px] leading-[36px] text-black">
                                    {project.title}
                                </h1>
                                {project.visibility !== "PUBLIC" && (
                                    <div className="flex items-center gap-1.5 px-3 h-[33px] border border-black rounded-[5px] shrink-0">
                                        <MessageCircle className="w-[18px] h-[18px] text-black" />
                                        <span className="font-['Poppins',sans-serif] text-[16px] text-black">
                                            {project.visibility === "PRIVATE" ? "Privé" : "Membres"}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant={"default"} className="flex items-center gap-2">
                                    <span>Privée</span>
                                    <MessageCircleMore className="w-4 h-4" />
                                </Button>

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
                                        {!isOwner && (
                                            <DropdownMenuItem
                                                disabled={isReporting}
                                                onClick={() =>
                                                    report(undefined, {
                                                        onSuccess: () => toast.success("Projet signalé. Merci pour votre retour."),
                                                        onError: (err) => toast.error(err.message),
                                                    })
                                                }
                                            >
                                                Signaler
                                            </DropdownMenuItem>
                                        )}
                                        {isOwner && (
                                            <>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => setDeleteOpen(true)}
                                                >
                                                    Supprimer le projet
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Auteur + date */}
                        <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9">
                                <AvatarImage src={project.owner.image ?? undefined} />
                                <AvatarFallback className="text-xs bg-neutral-100">
                                    {getInitialName(project.owner)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                                <span className="font-['Poppins',sans-serif] text-sm font-medium text-[#4c4a43] truncate">
                                    {getDisplayName(project.owner)}
                                </span>
                                <span className="font-['Poppins',sans-serif] text-xs text-[#8c8a85]">
                                    {timeAgo(project.createdAt)}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="font-['Poppins',sans-serif] text-[16px] leading-[24px] text-black whitespace-pre-line">
                            {project.description}
                        </p>

                        {/* Pièces jointes */}
                        {attachments.length > 0 && (
                            <div className="flex flex-col gap-3">
                                <p className="font-['Poppins',sans-serif] font-medium text-[20px] leading-[28px] text-black">
                                    Pièces jointes
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {attachments.map((att, i) => (
                                        <a
                                            key={i}
                                            href={att.url}
                                            target="_blank"
                                            rel="noreferrer noopener"
                                            className="inline-flex items-center gap-1.5 px-3 h-[33px] border border-black rounded-[5px] font-['Poppins',sans-serif] text-[12px] text-black hover:bg-neutral-50 transition-colors"
                                        >
                                            {att.name}
                                            <ExternalLink className="w-[17px] h-[17px] text-black" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Commentaires */}
                        <div className="flex flex-col gap-4 pt-2">
                            <CommentRoot target={{ type: "project", id: project.id }} />
                            <p className="font-['Poppins',sans-serif] text-[16px] text-black text-center">
                                {project.commentCount} commentaire{project.commentCount !== 1 ? "s" : ""}
                            </p>
                            <Comments target={{ type: "project", id: project.id }} />
                        </div>
                    </div>

                    {/* Colonne droite : sticky */}
                    <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
                        {/* Bouton Postuler — masqué pour le créateur */}
                        {!isOwner && (
                            <Button
                                className="w-full h-[55px] bg-[#ea3d0e] hover:bg-[#d13500] text-white font-['Poppins',sans-serif] font-bold text-[20px] leading-[24px] rounded-[5px] border-0"
                                onClick={handleApply}
                                disabled={isApplying}
                            >
                                {isApplying ? "Envoi..." : "Postuler au projet"}
                            </Button>
                        )}

                        {/* Bouton Modifier — visible uniquement par le créateur */}
                        {isOwner && (
                            <Button
                                variant="outline"
                                className="w-full h-[55px] font-['Poppins',sans-serif] font-semibold text-[18px] leading-[24px] rounded-[5px] gap-2"
                                onClick={() => setEditOpen(true)}
                            >
                                <Pencil className="w-5 h-5" />
                                Modifier le projet
                            </Button>
                        )}

                        {/* Card Infos pratiques */}
                        <div className="bg-white rounded-[10px] p-[27px] flex flex-col gap-0">
                            <h2 className="font-['Poppins',sans-serif] font-semibold text-[24px] leading-[32px] text-black mb-4">
                                Infos pratiques
                            </h2>
                            <div className="w-full h-px bg-[#e8e8e1] rounded-full mb-6" />

                            {hasInfos ? (
                                <div className="flex flex-col gap-8">
                                    {project.projectType && (
                                        <InfoBlock
                                            icon={<Briefcase className="w-6 h-6 text-black" />}
                                            label="Type de projet"
                                            value={project.projectType}
                                        />
                                    )}

                                    {(project.mapLocation || workModeStr) && (
                                        <InfoBlock
                                            icon={<MapPin className="w-6 h-6 text-black" />}
                                            label="Localisation"
                                            value={[project.mapLocation?.name, workModeStr].filter(Boolean).join(" / ")}
                                        />
                                    )}

                                    {remuInfo && (
                                        <InfoBlock
                                            icon={<Wallet className="w-6 h-6 text-black" />}
                                            label="Rémunération"
                                            value={remuInfo.label}
                                            valueClassName={remuInfo.color}
                                        />
                                    )}

                                    {levelStr && (
                                        <InfoBlock
                                            icon={<GraduationCap className="w-6 h-6 text-black" />}
                                            label="Niveau"
                                            value={levelStr}
                                        />
                                    )}

                                    {project.startDate && (
                                        <InfoBlock
                                            icon={<CalendarDays className="w-6 h-6 text-black" />}
                                            label="Date Début"
                                            value={new Date(project.startDate).toLocaleDateString("fr-FR", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })}
                                        />
                                    )}

                                    {roles.length > 0 && (
                                        <div className="flex flex-col gap-3">
                                            <p className="font-['Poppins',sans-serif] font-medium text-[16px] leading-[24px] text-black">
                                                Rôles recherchés
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {roles.map((role, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-flex items-center h-[25px] px-4 bg-[#e8e8e1] rounded-[4px] font-['Poppins',sans-serif] text-[12px] text-black"
                                                    >
                                                        {role}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="font-['Poppins',sans-serif] text-sm text-[#8c8a85] italic">
                                    Aucune information renseignée.
                                </p>
                            )}
                        </div>
                    </aside>
                </div>
            </div>

            {/* ── Modal édition ── */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogPortal>
                    <DialogOverlay />
                    <DialogContent className="p-0 gap-0 w-full max-w-[820px] h-[600px] flex overflow-hidden rounded-xl">
                        <DialogTitle className="sr-only">Modifier le projet</DialogTitle>
                        <DialogDescription className="sr-only">Formulaire de modification du projet</DialogDescription>
                        <EditProjectForm project={project} onSuccess={() => setEditOpen(false)} />
                    </DialogContent>
                </DialogPortal>
            </Dialog>

            {/* ── Confirmation suppression ── */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer ce projet ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. Le projet et tous ses commentaires seront définitivement supprimés.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isDeleting}
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={() =>
                                deleteProject(project.id, {
                                    onSuccess: () => {
                                        toast.success("Projet supprimé.");
                                        router.push("/marketplace");
                                    },
                                    onError: (err) => toast.error(err.message),
                                })
                            }
                        >
                            {isDeleting ? "Suppression…" : "Supprimer"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

function InfoBlock({
    icon,
    label,
    value,
    valueClassName,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    valueClassName?: string;
}) {
    return (
        <div className="grid grid-cols-[24px_1fr] gap-x-3 gap-y-1">
            <div className="row-start-1 col-start-1 mt-0.5">{icon}</div>
            <p className="row-start-1 col-start-2 font-['Poppins',sans-serif] font-medium text-[16px] leading-[24px] text-black">
                {label}
            </p>
            <p className={cn("row-start-2 col-start-2 font-['Poppins',sans-serif] text-[16px] leading-[24px] text-[#4c4a43]", valueClassName)}>
                {value}
            </p>
        </div>
    );
}
