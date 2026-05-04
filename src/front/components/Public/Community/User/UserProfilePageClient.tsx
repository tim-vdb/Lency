"use client";

import PostAudio from "@/front/components/Public/Community/Posts/PostAudio";
import PostDesktop from "@/front/components/Public/Community/Posts/PostDesktop";
import PostMobile from "@/front/components/Public/Community/Posts/PostMobile";
import PostText from "@/front/components/Public/Community/Posts/PostText";
import ProjectCard from "@/front/components/Public/Community/Projects/ProjectCard";
import UserAchievementsCard from "@/front/components/Public/Community/User/UserAchievementsCard";
import UserFollowersList from "@/front/components/Public/Community/User/UserFollowersList";
import UserFollowingCommunities from "@/front/components/Public/Community/User/UserFollowingCommunities";
import UserProfileHeader from "@/front/components/Public/Community/User/UserProfileHeader";
import { Button } from "@/front/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/front/components/ui/tabs";
import { useUserByUsername } from "@/front/hooks/queries/use-users";
import { useBreadcrumbOverride } from "@/front/hooks/use-breadcrumb-override";
import { MapPin } from "lucide-react";
import { toast } from "sonner";

export default function UserProfilePageClient({ username }: { username: string }) {
    const { data: user, isPending, error } = useUserByUsername(username);
    const displayName = user?.firstname && user?.lastname
        ? `${user.firstname} ${user.lastname}`
        : user?.username;
    useBreadcrumbOverride(username, displayName);

    if (isPending) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-neutral-500">Chargement...</p>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-neutral-500">Utilisateur introuvable.</p>
            </div>
        );
    }

    return (
        <div className="flex justify-between gap-4">
            <div className="col-span-5 flex flex-col gap-4 flex-1">
                <UserProfileHeader user={user} />
                <Tabs defaultValue="posts" className="w-full">
                    <div className="flex items-center justify-between gap-4">
                        <TabsList>
                            <TabsTrigger value="posts">Posts ({user._count.Posts})</TabsTrigger>
                            <TabsTrigger value="projects">Projets ({user._count.projects})</TabsTrigger>
                        </TabsList>

                        <div className="col-span-2 flex flex-col gap-3 sticky top-2 self-start">
                            <Button
                                variant="outline"
                                className="gap-1.5 w-full"
                                onClick={() => toast.info("Bientôt disponible")}
                            >
                                <MapPin className="w-4 h-4" />
                                Voir la localisation
                            </Button>
                        </div>
                    </div>

                    <div>
                        <TabsContent value="posts" className="flex justify-between gap-4 mt-4">
                            <div className="flex-1">
                                {user.Posts.length === 0 && (
                                    <p className="text-sm text-neutral-500">Aucun post publié.</p>
                                )}
                                {user.Posts.map((post) => (
                                    <div key={post.id}>
                                        {post.format === "IMAGE" && <PostDesktop post={post} />}
                                        {post.format === "VIDEO" && <PostMobile post={post} />}
                                        {post.format === "AUDIO" && <PostAudio post={post} />}
                                        {post.format === "TEXT" && <PostText post={post} />}
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col gap-2">
                                <UserFollowingCommunities follows={user.categoryFollows} />
                                <UserFollowersList followers={user.followers} />
                                <UserAchievementsCard badges={user.badges} userId={user.id} />
                            </div>
                        </TabsContent>
                        <TabsContent value="projects" className="flex justify-between gap-4 mt-4">
                            <div className="flex-1">
                                {user.projects.length === 0 && (
                                    <p className="text-sm text-neutral-500">Aucun projet.</p>
                                )}
                                {user.projects.map((project) => (
                                    <ProjectCard key={project.id} project={project} />
                                ))}
                            </div>
                            <div className="flex flex-col gap-2">
                                <UserFollowingCommunities follows={user.categoryFollows} />
                                <UserFollowersList followers={user.followers} />
                                <UserAchievementsCard badges={user.badges} userId={user.id} />
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
