"use client";

import PostAudio from "@/front/components/Public/Community/Posts/PostAudio";
import PostImage from "@/front/components/Public/Community/Posts/PostImage";
import PostVideo from "@/front/components/Public/Community/Posts/PostVideo";
import PostText from "@/front/components/Public/Community/Posts/PostText";
import PostSkeleton, { PostImageSkeleton } from "@/front/components/Public/Community/Posts/PostSkeleton";
import ProjectCard from "@/front/components/Public/Marketplace/Projects/ProjectCard";
import UserAchievementsCard from "@/front/components/Public/Community/User/UserAchievementsCard";
import UserFollowingCommunities from "@/front/components/Public/Community/User/UserFollowingCommunities";
import UserProfileHeader from "@/front/components/Public/Community/User/UserProfileHeader";
import UserStats from "@/front/components/Public/Community/User/UserStats";
import { Button } from "@/front/components/ui/button";
import { Card, CardContent } from "@/front/components/ui/card";
import { Skeleton } from "@/front/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/front/components/ui/tabs";
import { useUserByUsername } from "@/front/hooks/queries/use-users";
import { usePostsByAuthor } from "@/front/hooks/queries/use-posts";
import { useResourcesByAuthor } from "@/front/hooks/queries/use-resources";
import ResourceCard from "@/front/components/Public/Community/Resources/ResourceCard";
import { TalentProfileModal } from "@/front/components/Private/Global/TalentProfileModal";
import { useUser } from "@/front/context/UserContext";
import { useBreadcrumbOverride } from "@/front/hooks/use-breadcrumb-override";
import { ExternalLink, FileText, MapPin, Sparkles, UserCog } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getDisplayName } from "@/front/lib/utils";
import { UserProfile } from "@/front/types/user.schema";

function TalentProfileCard({ user }: { user: UserProfile }) {
    if (!user.isMarketplaceTalent) return null;

    return (
        <Card className="border-orange/30 bg-orange/5">
            <CardContent className="p-4 flex flex-col gap-3">
                {/* Header */}
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange shrink-0" />
                    <span className="text-sm font-semibold text-foreground">Talent disponible</span>
                    <span className="ml-auto w-2 h-2 rounded-full bg-green-500 shrink-0" title="Disponible" />
                </div>

                {/* Catégories suivies */}
                {user.categoryFollows.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Spécialités
                        </span>
                        <div className="flex flex-wrap gap-1">
                            {user.categoryFollows.slice(0, 4).map(({ category }) => (
                                <span
                                    key={category.id}
                                    className="inline-flex items-center h-5 px-2 bg-white rounded-full border border-neutral-200 text-[11px] text-foreground"
                                >
                                    {category.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Badges / rôles */}
                {user.badges.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Rôles
                        </span>
                        <div className="flex flex-wrap gap-1">
                            {user.badges.slice(0, 4).map((badge) => (
                                <span
                                    key={badge.id}
                                    className="inline-flex items-center h-5 px-2 border border-foreground rounded text-[11px] text-foreground"
                                >
                                    {badge.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Portfolio + CV */}
                {(user.portfolio || user.cv) && (
                    <div className="flex flex-col gap-1.5 pt-1 border-t border-orange/20">
                        {user.portfolio && (
                            <a
                                href={user.portfolio}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="flex items-center gap-2 text-xs text-foreground hover:text-orange transition-colors"
                            >
                                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">Portfolio</span>
                            </a>
                        )}
                        {user.cv && (
                            <a
                                href={user.cv}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="flex items-center gap-2 text-xs text-foreground hover:text-orange transition-colors"
                            >
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

function UserProfileSkeleton() {
    return (
        <div className="max-w-5xl mx-auto flex flex-col gap-6">
            {/* Header : card gauche + stats droite */}
            <div className="flex gap-6 items-center">
                {/* Card gauche */}
                <Card className="shrink-0 w-64 py-5 min-w-md">
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

                <div className="flex gap-6 items-start">
                    {/* Posts */}
                    <div className="flex-1 flex flex-col gap-4">
                        <PostSkeleton />
                        <PostImageSkeleton />
                        <PostSkeleton />
                    </div>
                    {/* Sidebar */}
                    <div className="w-60 shrink-0 flex flex-col gap-3">
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
            <div className="flex gap-6 items-center">
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
                <div className="flex gap-6 mt-6 items-start">

                    {/* Contenu principal */}
                    <div className="flex-1 min-w-0">
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

                    <div className="w-60 shrink-0 flex flex-col gap-3 sticky top-2 self-start">
                        <Button
                            variant="outline"
                            className="w-full gap-2"
                            onClick={() => toast.info("En développement")}
                        >
                            <MapPin className="w-4 h-4" />
                            Voir la localisation
                        </Button>
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
                        <TalentProfileCard user={user} />
                        <UserFollowingCommunities follows={user.categoryFollows} />
                        <UserAchievementsCard badges={user.badges} userId={user.id} />
                    </div>

                    <TalentProfileModal open={talentModalOpen} onOpenChange={setTalentModalOpen} />
                </div>
            </Tabs>
        </div>
    );
}
