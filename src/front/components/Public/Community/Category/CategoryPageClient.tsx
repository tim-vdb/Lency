"use client";

import PostAudio from "@/front/components/Public/Community/Posts/PostAudio";
import PostDesktop from "@/front/components/Public/Community/Posts/PostDesktop";
import PostMobile from "@/front/components/Public/Community/Posts/PostMobile";
import PostText from "@/front/components/Public/Community/Posts/PostText";
import { Avatar, AvatarFallback, AvatarImage } from "@/front/components/ui/avatar";
import { Badge } from "@/front/components/ui/badge";
import { Button } from "@/front/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/front/components/ui/card";
import { Separator } from "@/front/components/ui/separator";
import { useCategoryBySlug, useFollowStatus, usePostsByCategory, useToggleFollowCategory } from "@/front/hooks/queries/use-categories";
import { useBreadcrumbOverride } from "@/front/hooks/use-breadcrumb-override";
import { BookOpen, Check, Settings, Users } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CategoryPageClient({ slug }: { slug: string }) {
    const { data: category, isPending: categoryPending } = useCategoryBySlug(slug);
    const { data: postsData, isPending: postsPending } = usePostsByCategory(category?.id ?? "");
    const { data: followData } = useFollowStatus(category?.id ?? "");
    const { mutate: toggleFollow, isPending: followPending } = useToggleFollowCategory(category?.id ?? "");
    const isFollowing = followData?.following ?? false;
    useBreadcrumbOverride(slug, category?.name, "category");

    function handleFollow() {
        if (!category) return;
        toggleFollow(undefined, {
            onSuccess: (data) => {
                toast.success(data.following ? `Vous suivez maintenant ${category.name}.` : `Vous ne suivez plus ${category.name}.`);
            },
        });
    }

    const creatorInitials = category?.name?.slice(0, 2).toUpperCase() ?? "?";

    if (categoryPending) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-neutral-500">Chargement...</p>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-neutral-500">Catégorie introuvable.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Bandeau */}
            <div className="relative w-full h-32 rounded-xl overflow-hidden bg-linear-to-r from-pink-200 via-pink-100 to-rose-200">
                {category.bannerUrl && (
                    <img
                        src={category.bannerUrl}
                        alt={category.name}
                        className="w-full h-full object-cover absolute inset-0"
                    />
                )}
            </div>

            <div className="grid grid-cols-7 gap-4">
                {/* Colonne principale */}
                <div className="col-span-5 flex flex-col gap-4">
                    {/* En-tête catégorie */}
                    <div className="flex items-center gap-4">
                        {/* Icône catégorie */}
                        <Avatar className="w-14 h-14 border-4 border-background shadow-md">
                            <AvatarImage src={category.iconUrl ?? undefined} alt={category.name} />
                            <AvatarFallback className="bg-pink-100 text-pink-700 text-lg font-semibold">
                                {creatorInitials}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl font-bold truncate">{category.name}</h1>
                            {category.description && (
                                <p className="text-sm text-neutral-500 line-clamp-1">{category.description}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <Button
                                variant={isFollowing ? "outline" : "default"}
                                size="sm"
                                onClick={handleFollow}
                                disabled={followPending}
                                className="gap-1.5"
                            >
                                {isFollowing && <Check className="w-3.5 h-3.5" />}
                                {isFollowing ? "Suivi" : "Rejoindre"}
                            </Button>
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                                <Settings className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <Separator />

                    {/* Posts */}
                    {postsPending && <p className="text-neutral-500 text-sm">Chargement des posts...</p>}
                    {!postsPending && postsData?.length === 0 && (
                        <p className="text-neutral-500 text-sm">Aucun post dans cette catégorie.</p>
                    )}
                    {postsData?.map((post) => (
                        <div key={post.id}>
                            {post.format === "DESKTOP" && <PostDesktop post={post} />}
                            {post.format === "MOBILE" && <PostMobile post={post} />}
                            {post.format === "AUDIO" && <PostAudio post={post} />}
                            {post.format === "TEXT" && <PostText post={post} />}
                        </div>
                    ))}
                </div>

                {/* Sidebar */}
                <div className="col-span-2 flex flex-col gap-3 sticky top-2 self-start">
                    {/* Infos catégorie */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">À propos</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            {category.description && (
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    {category.description}
                                </p>
                            )}
                            <div className="flex items-center gap-2 text-sm">
                                <Users className="w-4 h-4 text-neutral-400" />
                                <span className="font-semibold">{category.subscriberCount}</span>
                                <span className="text-neutral-500">Membres</span>
                            </div>
                            {category.rules && (
                                <>
                                    <Separator />
                                    <div>
                                        <p className="text-xs font-medium mb-1">Règles</p>
                                        <p className="text-xs text-neutral-500 leading-relaxed">{category.rules}</p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Vos responsables */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Vos responsables</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <Avatar className="w-7 h-7">
                                    <AvatarFallback className="text-xs bg-neutral-100">
                                        {creatorInitials}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-neutral-700 dark:text-neutral-300">Créateur</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Ressources */}
                    <Button asChild variant="outline" className="gap-1.5 w-full">
                        <Link href={`/community/${slug}/resources`}>
                            <BookOpen className="w-4 h-4" />
                            Voir les ressources
                        </Link>
                    </Button>

                    {/* Sujets de communauté */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Sujets de communauté</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-1.5">
                            <Badge variant="secondary" className="text-xs">Général</Badge>
                            <Badge variant="secondary" className="text-xs">Actualités</Badge>
                            <Badge variant="secondary" className="text-xs">Projets</Badge>
                        </CardContent>
                    </Card>

                    {/* Modérateur */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Modérateur</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <Avatar className="w-7 h-7">
                                    <AvatarFallback className="text-xs bg-pink-100 text-pink-700">
                                        {creatorInitials}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-neutral-700 dark:text-neutral-300">
                                    {category.name}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
