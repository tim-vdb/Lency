"use client";

import PostAudio from "@/front/components/Public/Community/Posts/PostAudio";
import PostImage from "@/front/components/Public/Community/Posts/PostImage";
import PostVideo from "@/front/components/Public/Community/Posts/PostVideo";
import PostText from "@/front/components/Public/Community/Posts/PostText";
import PostSkeleton, { PostImageSkeleton } from "@/front/components/Public/Community/Posts/PostSkeleton";
import RecentlyViewedSidebar from "@/front/components/Public/Community/Sidebar/RecentlyViewed/RecentlyViewedSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/front/components/ui/tabs";
import { useFollowedCategoryPosts, usePosts } from "@/front/queries/posts";
import { useCategories } from "@/front/queries/categories";
import { useMemo } from "react";
import type { PostWithUserState } from "@/front/schemas/types/post.type";
import type { Category } from "@/front/lib/api/categories";
import { FileText, Paperclip, Users } from "lucide-react";
import { Skeleton } from "@/front/components/ui/skeleton";
import Link from "next/link";

function formatCount(n: number): string {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    return String(n);
}

function CommunityCard({ category }: { category: Category }) {
    return (
        <Link href={`/community/${category.slug}`} className="block group">
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-200">
                <div className="relative w-full h-28 bg-neutral-100 dark:bg-neutral-800 shrink-0 overflow-hidden">
                    {category.bannerUrl ? (
                        <img
                            src={category.bannerUrl}
                            alt={category.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                        />
                    ) : (
                        <div className="w-full h-full bg-linear-to-br from-orange-50 via-pink-50 to-violet-100" />
                    )}
                </div>
                <div className="p-3 flex flex-col gap-2">
                    <h3 className="text-sm font-bold text-foreground leading-tight line-clamp-1">{category.name}</h3>
                    {category.description && (
                        <p className="text-xs text-neutral-500 line-clamp-2 leading-4">{category.description}</p>
                    )}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="flex items-center gap-1 bg-neutral-900 text-white rounded-full px-2 py-0.5 text-[10px] font-medium">
                            <Users className="w-2.5 h-2.5" />
                            {formatCount(category.subscriberCount)}
                        </span>
                        <span className="flex items-center gap-1 bg-neutral-900 text-white rounded-full px-2 py-0.5 text-[10px] font-medium">
                            <FileText className="w-2.5 h-2.5" />
                            {formatCount(category._count.posts)}
                        </span>
                        <span className="flex items-center gap-1 bg-neutral-900 text-white rounded-full px-2 py-0.5 text-[10px] font-medium">
                            <Paperclip className="w-2.5 h-2.5" />
                            {formatCount(category._count.ressources)}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

function CommunitiesGridSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-neutral-200 overflow-hidden">
                    <Skeleton className="w-full h-28" />
                    <div className="p-3 flex flex-col gap-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function PostListSkeleton() {
    return (
        <div className="flex flex-col gap-4 max-w-3xl">
            {Array.from({ length: 5 }).map((_, i) =>
                i === 1 ? <PostImageSkeleton key={i} /> : <PostSkeleton key={i} />
            )}
        </div>
    );
}

function PostList({ posts }: { posts: PostWithUserState[] }) {
    return (
        <div className="flex flex-col gap-4 max-w-3xl">
            {posts.map((post) => (
                <div key={post.id}>
                    {post.format === "IMAGE" && <PostImage post={post} />}
                    {post.format === "VIDEO" && <PostVideo post={post} />}
                    {post.format === "AUDIO" && <PostAudio post={post} />}
                    {post.format === "TEXT" && <PostText post={post} />}
                </div>
            ))}
        </div>
    );
}

export default function CommunityPageClient() {
    const { data: posts, isPending } = usePosts();
    const { data: followedPosts, isPending: followedPending } = useFollowedCategoryPosts();
    const { data: categories, isPending: categoriesPending } = useCategories();

    const popularPosts = useMemo(() => {
        if (!posts) return [];
        return [...posts].sort((a, b) => b.upvoteCount - a.upvoteCount);
    }, [posts]);

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Communauté</h1>
            <Tabs defaultValue="general" className="flex flex-col gap-4 w-full">
                <TabsList className="w-fit justify-start p-0">
                    <TabsTrigger value="general">Général</TabsTrigger>
                    <TabsTrigger value="popular">Populaire</TabsTrigger>
                    <TabsTrigger value="following">Suivis</TabsTrigger>
                </TabsList>
                <div className="lg:flex lg:gap-4 items-start w-full">
                    <div className="flex-1 min-w-0">
                        <TabsContent value="general" className="flex flex-col gap-4 mt-0">
                            {isPending && <PostListSkeleton />}
                            {!isPending && posts?.length === 0 && <p>Aucun post trouvé.</p>}
                            {posts && <PostList posts={posts} />}
                        </TabsContent>
                        <TabsContent value="popular" className="flex flex-col gap-4 mt-0">
                            {isPending && <PostListSkeleton />}
                            {!isPending && popularPosts.length === 0 && <p>Aucun post trouvé.</p>}
                            {popularPosts.length > 0 && <PostList posts={popularPosts} />}
                        </TabsContent>
                        <TabsContent value="following" className="flex flex-col gap-4 mt-0">
                            {followedPending && <PostListSkeleton />}
                            {!followedPending && followedPosts?.length === 0 && (
                                <p className="text-neutral-500 text-sm">
                                    Vous ne suivez aucune communauté. Rejoignez des communautés pour voir leurs posts ici.
                                </p>
                            )}
                            {followedPosts && <PostList posts={followedPosts} />}
                        </TabsContent>
                    </div>

                    <RecentlyViewedSidebar />
                </div>
            </Tabs>
        </div>
    );
}
