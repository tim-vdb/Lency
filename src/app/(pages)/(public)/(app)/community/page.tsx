"use client"

import PostAudio from "@/front/components/Public/Community/Posts/PostAudio";
import PostImage from "@/front/components/Public/Community/Posts/PostImage";
import PostVideo from "@/front/components/Public/Community/Posts/PostVideo";
import PostText from "@/front/components/Public/Community/Posts/PostText";
import PostSkeleton, { PostImageSkeleton } from "@/front/components/Public/Community/Posts/PostSkeleton";
import RecentlyViewed, { RecentlyViewedSkeleton } from "@/front/components/Public/Community/Sidebar/RecentlyViewed";
import { Button } from "@/front/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/front/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/front/components/ui/tabs"
import { useRecentlyViewed } from "@/front/stores/use-recently-viewed.store";
import { useFollowedCategoryPosts, usePosts } from "@/front/hooks/queries/use-posts"
import { useMemo, useState, useEffect } from "react";
import type { PostWithUserState } from "@/front/types/post.schema";

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
    )
}

export default function CommunityPage() {
    const { data: posts, isPending } = usePosts()
    const { data: followedPosts, isPending: followedPending } = useFollowedCategoryPosts()
    const entries = useRecentlyViewed((s) => s.entries)
    const clearViewed = useRecentlyViewed((s) => s.clear)
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    const popularPosts = useMemo(() => {
        if (!posts) return [];
        return [...posts].sort((a, b) => b.upvoteCount - a.upvoteCount);
    }, [posts])

    return (
        <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="general" className="flex flex-col gap-4 w-full">
                <TabsList className="w-fit justify-start p-0">
                    <TabsTrigger value="general">Général</TabsTrigger>
                    <TabsTrigger value="popular">Populaire</TabsTrigger>
                    <TabsTrigger value="following">Suivis</TabsTrigger>
                </TabsList>
                <div className="lg:flex lg:gap-4 items-start justify-center w-full">
                    <div className="">
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
                                    Vous ne suivez aucune catégorie. Rejoignez des catégories pour voir leurs posts ici.
                                </p>
                            )}
                            {followedPosts && <PostList posts={followedPosts} />}
                        </TabsContent>
                    </div>

                    <div className="sticky top-0.5 w-60 p-4 bg-white rounded-xl">
                        <Card className="hidden lg:block shrink-0 shadow-none">
                            <CardHeader className="flex items-center justify-between gap-2 px-2">
                                <CardTitle className="text-sm">Récemment vu</CardTitle>
                                <Button variant="ghost" size="sm" onClick={clearViewed} className="text-[#F79478] px-0">
                                    Nettoyer
                                </Button>
                            </CardHeader>
                            <CardContent className="px-2">
                                {!mounted
                                    ? <RecentlyViewedSkeleton />
                                    : <RecentlyViewed entries={entries} />
                                }
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Tabs>
        </div>
    );
}
