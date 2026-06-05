"use client"

import ExpandableText from "@/front/components/Public/Community/Posts/ExpandableText";
import PostSkeleton, { PostImageSkeleton } from "@/front/components/Public/Community/Posts/PostSkeleton";
import PostAudio from "@/front/components/Public/Community/Posts/PostAudio";
import PostImage from "@/front/components/Public/Community/Posts/PostImage";
import PostText from "@/front/components/Public/Community/Posts/PostText";
import PostVideo from "@/front/components/Public/Community/Posts/PostVideo";
import { Avatar, AvatarFallback, AvatarImage } from "@/front/components/ui/avatar";
import { Button } from "@/front/components/ui/button";
import { Card } from "@/front/components/ui/card";
import { Separator } from "@/front/components/ui/separator";
import { useCategoryBySlug, useCategoryNotifyStatus, useFollowStatus, usePostsByCategory, useToggleCategoryNotify, useToggleFollowCategory } from "@/front/queries/categories";
import { useResources } from "@/front/queries/resources";
import { useBreadcrumbOverride } from "@/front/hooks/use-breadcrumb-override";
import { Skeleton } from "@/front/components/ui/skeleton";
import { Bell, CalendarCheck, Check, Ellipsis } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import LencyIcon from "@/front/components/ui/lency-icon";

export default function CategoryPageClient({ slug }: { slug: string }) {
    const { data: category, isPending: categoryPending } = useCategoryBySlug(slug);
    const { data: postsData, isPending: postsPending } = usePostsByCategory(category?.id ?? "");
    const { data: followData } = useFollowStatus(category?.id ?? "");
    const { mutate: toggleFollow, isPending: followPending } = useToggleFollowCategory(category?.id ?? "");
    const { data: resources, isPending: resourcesPending } = useResources(category?.id);
    const { data: notifyData } = useCategoryNotifyStatus(category?.id ?? "");
    const { mutate: toggleNotify, isPending: notifyPending } = useToggleCategoryNotify(category?.id ?? "");
    const isFollowing = followData?.following ?? false;
    const isNotifying = notifyData?.subscribed ?? false;
    useBreadcrumbOverride(slug, category?.name, "category");

    function handleToggleNotify() {
        if (!category) return;
        toggleNotify(undefined, {
            onSuccess: (data) => {
                toast.success(data.subscribed
                    ? `Vous recevrez les notifications pour ${category.name}.`
                    : `Notifications désactivées pour ${category.name}.`
                );
            },
        });
    }

    function handleFollow() {
        if (!category) return;
        toggleFollow(undefined, {
            onSuccess: (data) => {
                toast.success(data.following ? `Vous suivez maintenant ${category.name}.` : `Vous ne suivez plus ${category.name}.`);
            },
        });
    }

    if (categoryPending) {
        return (
            <div className="relative flex flex-col md:flex-row gap-4 max-w-7xl mx-auto">
                <div className="flex flex-col gap-4 min-w-0 flex-1">
                    {/* Banner */}
                    <Skeleton className="w-full h-40 rounded-xl" />

                    {/* Title + actions */}
                    <div className="flex items-center justify-between gap-4">
                        <Skeleton className="h-8 w-48 rounded-md" />
                        <div className="flex items-center gap-2 shrink-0">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-8 w-24 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                    </div>

                    <Separator />

                    {/* Posts */}
                    {Array.from({ length: 3 }).map((_, i) => i === 1 ? <PostImageSkeleton key={i} /> : <PostSkeleton key={i} />)}
                </div>

                {/* Sidebar */}
                <div className="sticky top-0 self-start min-w-sm max-w-sm hidden md:block">
                    <Card className="overflow-hidden py-0 gap-0">
                        <div className="p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between gap-2">
                                <Skeleton className="h-4 w-28 rounded-md" />
                                <Skeleton className="h-8 w-20 rounded-md" />
                            </div>
                            <Skeleton className="h-3 w-full rounded-md" />
                            <Skeleton className="h-3 w-3/4 rounded-md" />
                            <Skeleton className="h-3 w-24 rounded-md" />
                            <Skeleton className="h-4 w-16 rounded-md" />
                        </div>

                        <Separator />

                        <div className="p-4 flex flex-col gap-3">
                            <Skeleton className="h-4 w-28 rounded-md" />
                            <div className="grid grid-cols-2 gap-2">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="flex flex-col gap-1">
                                        <Skeleton className="w-full aspect-video rounded-lg" />
                                        <Skeleton className="h-3 w-full rounded-md" />
                                    </div>
                                ))}
                            </div>
                            <Skeleton className="h-8 w-full rounded-md" />
                        </div>

                        <Separator />

                        <div className="p-4 flex flex-col gap-3">
                            <Skeleton className="h-4 w-24 rounded-md" />
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                                <Skeleton className="h-3 w-24 rounded-md" />
                            </div>
                        </div>
                    </Card>
                </div>
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
        <div className="relative flex flex-col xl:flex-row gap-4 max-w-7xl mx-auto">
            <div className="flex flex-col gap-4 flex-1 min-w-0">
                <div className="relative w-full h-40 rounded-xl overflow-hidden bg-linear-to-r from-pink-200 via-pink-100 to-rose-200">
                    {category.bannerUrl && (
                        <img
                            src={category.bannerUrl}
                            alt={category.name}
                            className="w-full h-full object-cover absolute inset-0"
                        />
                    )}
                </div>
                <div className="flex items-center justify-between gap-4">

                    <div className="min-w-0">
                        <h1 className="text-3xl font-bold truncate uppercase">{category.name}</h1>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`w-8 h-8 rounded-full border transition-colors ${isNotifying ? "bg-orange/10 border-orange text-orange hover:bg-orange/20" : "bg-white border-neutral-200 hover:bg-neutral-50"}`}
                            onClick={handleToggleNotify}
                            disabled={notifyPending}
                            title={isNotifying ? "Désactiver les notifications" : "Activer les notifications"}
                        >
                            <Bell className={`w-4 h-4 ${isNotifying ? "fill-orange stroke-orange" : ""}`} />
                        </Button>
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
                        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => { toast.info("En développement") }}>
                            <Ellipsis className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <Separator />

                {/* Posts */}
                {postsPending && Array.from({ length: 3 }).map((_, i) => i === 1 ? <PostImageSkeleton key={i} /> : <PostSkeleton key={i} />)}
                {!postsPending && postsData?.length === 0 && (
                    <p className="text-neutral-500 text-sm">Aucun post dans cette catégorie.</p>
                )}
                {postsData?.map((post) => (
                    <div key={post.id}>
                        {post.format === "IMAGE" && <PostImage post={post} />}
                        {post.format === "VIDEO" && <PostVideo post={post} />}
                        {post.format === "AUDIO" && <PostAudio post={post} />}
                        {post.format === "TEXT" && <PostText post={post} />}
                    </div>
                ))}
            </div>

            {/* Sidebar */}
            <div className="sticky top-0 self-start min-w-sm max-w-sm hidden xl:block">
                <Card className="overflow-hidden py-0 gap-0">

                    {/* Infos catégorie */}
                    <div className="p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-sm truncate">{category.name}</p>
                        </div>
                        {category.description && (
                            <ExpandableText content={category.description} lineClamp={3} className="text-xs" />
                        )}
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                            <CalendarCheck className="w-3.5 h-3.5 shrink-0" />
                            <span>Créé le {new Date(category.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                            <span className="font-semibold">{category.subscriberCount}</span>
                            <span className="text-neutral-500">Membres</span>
                        </div>
                    </div>

                    <Separator />

                    <div className="p-4 flex flex-col gap-3">
                        <p className="font-semibold text-sm">Vos ressources</p>
                        {resourcesPending && (
                            <div className="grid grid-cols-2 gap-2">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="flex flex-col gap-1">
                                        <Skeleton className="w-full aspect-video rounded-lg" />
                                        <Skeleton className="h-3 w-full rounded-md" />
                                    </div>
                                ))}
                            </div>
                        )}
                        {resources && resources.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                                {resources.slice(0, 4).map((resource) => (
                                    <Link key={resource.id} href={`/community/${slug}/resources/${resource.id}`} className="flex flex-col gap-1 group">
                                        <div className="w-full aspect-video rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                                            {resource.imageUrls?.[0] ? (
                                                <Image
                                                    src={resource.imageUrls[0]}
                                                    alt={resource.title}
                                                    width={120}
                                                    height={68}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-neutral-200 dark:bg-neutral-700" />
                                            )}
                                        </div>
                                        <p className="text-center text-xs text-neutral-700 dark:text-neutral-300 leading-tight line-clamp-2">{resource.title}</p>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-neutral-400 italic">Aucune ressource pour le moment.</p>
                        )}
                        <Button asChild variant="outline" size="sm" className="w-full">
                            <Link href={`/community/${slug}/resources`}>
                                Découvrir toutes les ressources
                            </Link>
                        </Button>
                    </div>

                    <Separator />

                    <div className="p-4 flex flex-col gap-3">
                        <p className="font-semibold text-sm">Modérateur</p>
                        <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={category.iconUrl ?? ""} alt={category.name} />
                                <AvatarFallback className="text-xs bg-neutral-100 dark:bg-neutral-800">
                                    <LencyIcon />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs font-medium truncate">Lency Bot</span>
                                <span className="text-[10px] text-neutral-400">Créateur</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div >
    );
}
