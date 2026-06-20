"use client";

import PostAudio from "@/front/components/Public/Community/Posts/PostAudio";
import PostImage from "@/front/components/Public/Community/Posts/PostImage";
import PostVideo from "@/front/components/Public/Community/Posts/PostVideo";
import PostText from "@/front/components/Public/Community/Posts/PostText";
import PostSkeleton, { PostImageSkeleton } from "@/front/components/Public/Community/Posts/PostSkeleton";
import ProjectCard from "@/front/components/Public/Marketplace/Projects/ProjectCard";
import UserFollowingCommunities from "@/front/components/Public/Community/User/UserFollowingCommunities";
import UserProfileHeader from "@/front/components/Public/Community/User/UserProfileHeader";
import UserStats from "@/front/components/Public/Community/User/UserStats";
import { Button } from "@/front/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/front/components/ui/tooltip";
import { Card, CardContent } from "@/front/components/ui/card";
import { Skeleton } from "@/front/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/front/components/ui/tabs";
import { useUserByUsername } from "@/front/queries/users";
import { usePostsByAuthor } from "@/front/queries/posts";
import { useResourcesByAuthor } from "@/front/queries/resources";
import ResourceCard from "@/front/components/Public/Community/Resources/ResourceCard";
import { TalentProfileModal } from "@/front/components/Private/Global/TalentProfileModal";
import { useUser } from "@/front/states/contexts/user.context";
import { useUpdateUser } from "@/front/queries/users";
import { useBreadcrumbOverride } from "@/front/hooks/use-breadcrumb-override";
import { Avatar, AvatarFallback, AvatarImage } from "@/front/components/ui/avatar";
import { Camera, ExternalLink, FileText, FolderOpen, Lightbulb, Mic, Monitor, Sparkles, TrendingUp, UserCog, Wallet, Wrench, Zap } from "lucide-react";
import { getInitialName } from "@/front/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { getDisplayName } from "@/front/lib/utils";
import Link from "next/link";
import { UserProfile } from "@/front/schemas/types/user.type";

const AV_SECTION_META: Record<string, { label: string; icon: React.ElementType }> = {
    cameras: { label: "Caméras", icon: Camera },
    lenses: { label: "Objectifs", icon: Wrench },
    lights: { label: "Lumières", icon: Lightbulb },
    software: { label: "Logiciels", icon: Monitor },
    audio: { label: "Audio", icon: Mic },
};

const WORKMODE_LABEL: Record<string, string> = { PRESENTIEL: "Présentiel", DISTANCIEL: "Distanciel", HYBRIDE: "Hybride" };
const LEVEL_LABEL: Record<string, string> = { DEBUTANT: "Débutant", INTERMEDIAIRE: "Intermédiaire", AVANCE: "Avancé" };
const REMU_LABEL: Record<string, string> = { REMUNERE: "Rémunéré", NON_REMUNERE: "Non rémunéré" };


function TalentProfileCard({ user }: { user: UserProfile }) {
    if (!user.isMarketplaceTalent) return null;

    const rolesConfig = user.configs?.find((c) => c.title === "roles");
    const roles: string[] = rolesConfig ? ((rolesConfig.content as { roles?: string[] }).roles ?? []) : [];

    const avConfig = user.configs?.find((c) => c.title === "audiovisual");
    const av: Record<string, string[]> = avConfig ? (avConfig.content as Record<string, string[]>) : {};
    const avSections = Object.entries(AV_SECTION_META)
        .map(([key, meta]) => ({ key, ...meta, items: av[key] ?? [] }))
        .filter((s) => s.items.length > 0);

    const prefsConfig = user.configs?.find((c) => c.title === "preferences");
    const prefs = prefsConfig ? (prefsConfig.content as { workMode?: string; level?: string; remunerationType?: string }) : {};
    const workModeLabel = prefs.workMode ? WORKMODE_LABEL[prefs.workMode] : null;
    const levelLabel = prefs.level ? LEVEL_LABEL[prefs.level] : null;
    const remuLabel = prefs.remunerationType ? REMU_LABEL[prefs.remunerationType] : null;

    return (
        <Card className="border-orange/30 bg-orange/5">
            <CardContent className="p-4 flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange shrink-0" />
                    <span className="text-sm font-semibold text-foreground">Talent disponible</span>
                    <span className="ml-auto w-2 h-2 rounded-full bg-green-500 shrink-0" title="Disponible" />
                </div>

                {/* Disponibilité (workMode / level / remu) */}
                {(workModeLabel || levelLabel || remuLabel) && (
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Disponibilité</span>
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                            {workModeLabel && (
                                <div className="flex items-center gap-1.5 text-xs text-foreground">
                                    <Zap className="w-3 h-3 text-orange shrink-0" />
                                    {workModeLabel}
                                </div>
                            )}
                            {levelLabel && (
                                <div className="flex items-center gap-1.5 text-xs text-foreground">
                                    <TrendingUp className="w-3 h-3 text-orange shrink-0" />
                                    {levelLabel}
                                </div>
                            )}
                            {remuLabel && (
                                <div className="flex items-center gap-1.5 text-xs text-foreground">
                                    <Wallet className="w-3 h-3 text-orange shrink-0" />
                                    {remuLabel}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Rôles (UserConfig) */}
                {roles.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Rôles</span>
                        <div className="flex flex-wrap gap-1">
                            {roles.map((role) => (
                                <span key={role} className="inline-flex items-center h-5 px-2 bg-orange/10 border border-orange/30 rounded text-[11px] text-orange font-medium">
                                    {role}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Équipements audiovisuels */}
                {avSections.length > 0 && (
                    <div className="flex flex-col gap-2.5 pt-1 border-t border-orange/20">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Équipements</span>
                        {avSections.map(({ key, label, icon: Icon, items }) => (
                            <div key={key} className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5">
                                    <Icon className="w-3 h-3 text-muted-foreground shrink-0" />
                                    <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
                                </div>
                                <div className="flex flex-wrap gap-1 pl-4">
                                    {items.map((item) => (
                                        <span key={item} className="text-[11px] text-foreground bg-muted px-1.5 py-0.5 rounded">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Portfolio + CV */}
                {(user.portfolio || user.cv) && (
                    <div className="flex flex-col gap-1.5 pt-1 border-t border-orange/20">
                        {user.portfolio && (
                            <a href={user.portfolio} target="_blank" rel="noreferrer noopener"
                                className="flex items-center gap-2 text-xs text-foreground hover:text-orange transition-colors">
                                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">Portfolio</span>
                            </a>
                        )}
                        {user.cv && (
                            <a href={user.cv} target="_blank" rel="noreferrer noopener"
                                className="flex items-center gap-2 text-xs text-foreground hover:text-orange transition-colors">
                                <FileText className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">Voir le CV</span>
                            </a>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function ParticipatedProjectsCard({ projects }: { projects: { id: string; title: string }[] }) {
    if (projects.length === 0) return null;
    return (
        <Card>
            <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Projets rejoints
                    </span>
                    <span className="ml-auto text-[11px] text-muted-foreground">{projects.length}</span>
                </div>
                <div className="flex flex-col gap-1">
                    {projects.map((p) => (
                        <Link
                            key={p.id}
                            href={`/marketplace/${p.id}`}
                            className="text-xs text-foreground hover:text-orange transition-colors truncate"
                        >
                            {p.title}
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export function UserProfileSkeleton() {
    return (
        <div className="max-w-5xl mx-auto flex flex-col gap-6">
            {/* Header : card gauche + stats droite */}
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                {/* Card gauche */}
                <Card className="shrink-0 w-full sm:w-64 py-5 sm:min-w-md">
                    <CardContent className="flex flex-col gap-4 px-5">
                        {/* Avatar + nom */}
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-20 h-20 rounded-full shrink-0" />
                            <div className="flex flex-col gap-2 flex-1">
                                <Skeleton className="h-5 w-32 rounded-md" />
                                <Skeleton className="h-3 w-20 rounded-md" />
                            </div>
                        </div>
                        {/* Boutons */}
                        <div className="flex gap-1.5 flex-wrap">
                            <Skeleton className="h-7 w-16 rounded-md" />
                            <Skeleton className="h-7 w-20 rounded-md" />
                            <Skeleton className="h-7 w-36 rounded-md" />
                        </div>
                        {/* Bio */}
                        <div className="flex flex-col gap-1.5">
                            <Skeleton className="h-3 w-full rounded-md" />
                            <Skeleton className="h-3 w-full rounded-md" />
                            <Skeleton className="h-3 w-2/3 rounded-md" />
                        </div>
                        {/* Socials */}
                        <div className="flex gap-3">
                            <Skeleton className="h-3 w-16 rounded-md" />
                            <Skeleton className="h-3 w-16 rounded-md" />
                            <Skeleton className="h-3 w-20 rounded-md" />
                        </div>
                    </CardContent>
                </Card>

                {/* Stats droite */}
                <div className="flex items-center justify-around flex-1 py-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-3">
                            <Skeleton className="h-16 w-24 rounded-md" />
                            <Skeleton className="h-5 w-28 rounded-md" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-col gap-6">
                <div className="flex gap-1">
                    <Skeleton className="h-9 w-20 rounded-md" />
                    <Skeleton className="h-9 w-20 rounded-md" />
                </div>

                <div className="flex flex-col xl:flex-row gap-6 items-start">
                    {/* Posts */}
                    <div className="flex-1 w-full flex flex-col gap-4">
                        <PostSkeleton />
                        <PostImageSkeleton />
                        <PostSkeleton />
                    </div>
                    {/* Sidebar */}
                    <div className="w-full xl:w-60 xl:shrink-0 flex flex-col gap-3">
                        <Skeleton className="h-9 w-full rounded-md" />
                        <Card>
                            <CardContent className="p-4 flex flex-col gap-2">
                                <Skeleton className="h-4 w-32 rounded-md" />
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {[...Array(4)].map((_, i) => (
                                        <Skeleton key={i} className="h-5 w-20 rounded-full" />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 flex flex-col gap-3">
                                <Skeleton className="h-4 w-24 rounded-md" />
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {[...Array(3)].map((_, i) => (
                                            <Skeleton key={i} className="w-8 h-8 rounded-full" />
                                        ))}
                                    </div>
                                    <Skeleton className="h-3 flex-1 rounded-md" />
                                </div>
                                <Skeleton className="h-8 w-full rounded-md" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function UserProfilePageClient({ username }: { username: string }) {
    const { data: user, isPending, error } = useUserByUsername(username);
    const { data: posts, isPending: postsPending } = usePostsByAuthor(user?.id);
    const { data: resources, isPending: resourcesPending } = useResourcesByAuthor(user?.id);
    const displayName = user ? getDisplayName(user) : undefined;
    useBreadcrumbOverride(username, displayName);

    const currentUser = useUser();
    const isOwnProfile = !!currentUser && !!user && currentUser.id === user.id;
    const [talentModalOpen, setTalentModalOpen] = useState(false);
    const [readyToStart, setReadyToStart] = useState(user?.readyToStart ?? false);
    const { mutate: updateUser, isPending: updatingReady } = useUpdateUser();

    function handleToggleReady() {
        if (!user) return;
        const next = !readyToStart;
        setReadyToStart(next);
        updateUser(
            { id: user.id, data: { readyToStart: next } },
            {
                onSuccess: () => toast.success(next ? "Statut « Prêt à démarrer » activé." : "Statut désactivé."),
                onError: () => { setReadyToStart(!next); toast.error("Une erreur est survenue."); },
            }
        );
    }

    if (isPending) return <UserProfileSkeleton />;

    if (error || !user) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-neutral-500">Utilisateur introuvable.</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto flex flex-col gap-6">

            {/* ── Header : card gauche + stats droite ── */}
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <UserProfileHeader user={user} />
                <UserStats user={user} />
            </div>

            {/* ── Tabs + content ── */}
            <Tabs defaultValue="posts">
                {/* Barre de tabs + bouton localisation */}
                <div className="flex items-center justify-between gap-4">
                    <TabsList className="p-0 h-auto gap-0 border-neutral-200 rounded-none">
                        <TabsTrigger
                            value="posts"
                            className="rounded-l-md rounded-r-none bg-white border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none px-4 pb-2 text-sm font-medium cursor-pointer"
                        >
                            Posts
                        </TabsTrigger>
                        <TabsTrigger
                            value="resources"
                            className="rounded-none bg-white border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none px-4 pb-2 text-sm font-medium cursor-pointer"
                        >
                            Ressources
                        </TabsTrigger>
                        <TabsTrigger
                            value="projects"
                            className="rounded-r-md rounded-l-none bg-white border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none px-4 pb-2 text-sm font-medium cursor-pointer"
                        >
                            Projets
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Colonnes : contenu gauche + sidebar droite */}
                <div className="flex flex-col xl:flex-row gap-6 mt-6 items-start">

                    {/* Contenu principal */}
                    <div className="flex-1 min-w-0 w-full">
                        <TabsContent value="posts" className="mt-0 flex flex-col gap-4">
                            {postsPending && (
                                <>
                                    <PostSkeleton />
                                    <PostImageSkeleton />
                                    <PostSkeleton />
                                </>
                            )}
                            {!postsPending && posts?.length === 0 && (
                                <p className="text-sm text-neutral-500">Aucun post publié.</p>
                            )}
                            {!postsPending && posts?.map((post, index) => (
                                <div key={index}>
                                    {post.format === "IMAGE" && <PostImage post={post} />}
                                    {post.format === "VIDEO" && <PostVideo post={post} />}
                                    {post.format === "AUDIO" && <PostAudio post={post} />}
                                    {post.format === "TEXT" && <PostText post={post} />}
                                </div>
                            ))}
                        </TabsContent>

                        <TabsContent value="resources" className="mt-0">
                            {resourcesPending && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="rounded-xl border border-border overflow-hidden flex flex-col gap-3 py-3">
                                            <Skeleton className="mx-3 h-40 rounded-md" />
                                            <div className="px-4 flex flex-col gap-2">
                                                <Skeleton className="h-3 w-3/4 rounded-md" />
                                                <Skeleton className="h-3 w-1/2 rounded-md" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {!resourcesPending && resources?.length === 0 && (
                                <p className="text-sm text-neutral-500">Aucune ressource publiée.</p>
                            )}
                            {!resourcesPending && resources && resources.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {resources.map((resource) => (
                                        <ResourceCard key={resource.id} resource={resource} variant="grid" />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="projects" className="mt-0">
                            {user.projects.length === 0 && (
                                <p className="text-sm text-neutral-500">Aucun projet.</p>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {user.projects.map((project) => (
                                    <ProjectCard key={project.id} project={project} showProjectType />
                                ))}
                            </div>
                        </TabsContent>
                    </div>

                    <div className="w-full xl:w-60 xl:shrink-0 flex flex-col gap-3 xl:sticky xl:top-2 xl:self-start">
                        {isOwnProfile && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            disabled={updatingReady}
                                            onClick={handleToggleReady}
                                            className={`w-full gap-2 transition-colors ${readyToStart
                                                ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                                                : ""}`}
                                        >
                                            <Zap className={`w-4 h-4 ${readyToStart ? "fill-emerald-500" : ""}`} />
                                            {readyToStart ? "Prêt à démarrer ✓" : "Se marquer disponible"}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" className="max-w-56 text-center">
                                        Les autres membres vous verront comme disponible et pourront vous inviter à rejoindre leurs projets.
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                        {isOwnProfile && (
                            <Button
                                variant="outline"
                                className="w-full gap-2"
                                onClick={() => setTalentModalOpen(true)}
                            >
                                <UserCog className="w-4 h-4" />
                                {user.isMarketplaceTalent ? "Modifier le profil talent" : "Créer le profil talent"}
                            </Button>
                        )}
                        {/* readyToStart — visible par tous, une seule fois ici */}
                        {!isOwnProfile && user.readyToStart && (
                            <div className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-xs font-medium border bg-emerald-50 border-emerald-200 text-emerald-700">
                                <Zap className="w-3.5 h-3.5 shrink-0 fill-emerald-500" />
                                Prêt à démarrer
                            </div>
                        )}
                        <TalentProfileCard user={user} />
                        <ParticipatedProjectsCard projects={[
                            ...user.projects.filter((p) => p.visibility === "PUBLIC" && p.status === "PUBLISHED").map((p) => ({ id: p.id, title: p.title })),
                            ...(user.participants ?? []),
                        ]} />
                        <UserFollowingCommunities follows={user.categoryFollows} />

                        {isOwnProfile && user.following && user.following.length > 0 && (
                            <Card>
                                <CardContent className="p-4 flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                                            Suivi(e)s
                                        </p>
                                        <span className="text-xs text-neutral-400">
                                            {user.following.length}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {user.following.map(({ following: followed }) => (
                                            <Link
                                                key={followed.id}
                                                href={`/user/${followed.username ?? followed.id}`}
                                                title={followed.firstname && followed.lastname
                                                    ? `${followed.firstname} ${followed.lastname}`
                                                    : followed.username ?? "Utilisateur"}
                                            >
                                                <Avatar className="w-7 h-7 ring-2 ring-background hover:ring-primary transition-all">
                                                    <AvatarImage src={followed.image ?? undefined} />
                                                    <AvatarFallback className="text-[10px] bg-pink-100 text-pink-700">
                                                        {getInitialName(followed)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </Link>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <TalentProfileModal open={talentModalOpen} onOpenChange={setTalentModalOpen} />
                </div>
            </Tabs>
        </div>
    );
}
