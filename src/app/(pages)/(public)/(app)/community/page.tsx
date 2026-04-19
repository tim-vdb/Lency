"use client"

import PostAudio from "@/front/components/Public/Community/Posts/PostAudio";
import PostDesktop from "@/front/components/Public/Community/Posts/PostDesktop";
import PostMobile from "@/front/components/Public/Community/Posts/PostMobile";
import PostText from "@/front/components/Public/Community/Posts/PostText";
import RecentlyViewed from "@/front/components/Public/Community/Sidebar/RecentlyViewed";
import { Button } from "@/front/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/front/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/front/components/ui/tabs"
import { useRecentlyViewed } from "@/front/hooks/use-recently-viewed";
import { useFollowedCategoryPosts, usePosts } from "@/front/hooks/querys/use-posts"
import { useMemo } from "react";
import type { PostWithUserState } from "@/front/types/post.schema";

function PostList({ posts }: { posts: PostWithUserState[] }) {
    return (
        <>
            {posts.map((post) => (
                <div key={post.id}>
                    {post.format === "DESKTOP" && <PostDesktop post={post} />}
                    {post.format === "MOBILE" && <PostMobile post={post} />}
                    {post.format === "AUDIO" && <PostAudio post={post} />}
                    {post.format === "TEXT" && <PostText post={post} />}
                </div>
            ))}
        </>
    )
}

export default function CommunityPage() {
    const { data: posts, isPending } = usePosts()
    const { data: followedPosts, isPending: followedPending } = useFollowedCategoryPosts()
    const { entries, clearViewed } = useRecentlyViewed()

    const popularPosts = useMemo(() => {
        if (!posts) return [];
        return [...posts].sort((a, b) => b.upvoteCount - a.upvoteCount);
    }, [posts])

    return (
        <div>
            <Tabs defaultValue="general" className="flex flex-col gap-4 items-center justify-start">
                <TabsList className="w-md justify-evenly">
                    <TabsTrigger value="general">Général</TabsTrigger>
                    <TabsTrigger value="popular">Populaire</TabsTrigger>
                    <TabsTrigger value="following">Suivis</TabsTrigger>
                </TabsList>
                <div className="grid grid-cols-7 gap-2 w-full">
                    {/* Général */}
                    <TabsContent value="general" className="flex flex-col gap-4 mt-0 w-full col-span-5">
                        {isPending && <p>Chargement...</p>}
                        {!isPending && posts?.length === 0 && <p>Aucun post trouvé.</p>}
                        {posts && <PostList posts={posts} />}
                    </TabsContent>

                    {/* Populaire */}
                    <TabsContent value="popular" className="flex flex-col gap-4 mt-0 w-full col-span-5">
                        {isPending && <p>Chargement...</p>}
                        {!isPending && popularPosts.length === 0 && <p>Aucun post trouvé.</p>}
                        {popularPosts.length > 0 && <PostList posts={popularPosts} />}
                    </TabsContent>

                    {/* Suivis */}
                    <TabsContent value="following" className="flex flex-col gap-4 mt-0 w-full col-span-5">
                        {followedPending && <p>Chargement...</p>}
                        {!followedPending && followedPosts?.length === 0 && (
                            <p className="text-neutral-500 text-sm">
                                Vous ne suivez aucune catégorie. Rejoignez des catégories pour voir leurs posts ici.
                            </p>
                        )}
                        {followedPosts && <PostList posts={followedPosts} />}
                    </TabsContent>

                    {/* Sidebar */}
                    <div className="col-start-6 col-span-2">
                        <Card className="sticky top-0.5">
                            <CardHeader className="flex items-center justify-between gap-2">
                                <CardTitle>Récemment vu</CardTitle>
                                <Button variant="outline" size="sm" onClick={clearViewed}>
                                    Nettoyer
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <RecentlyViewed entries={entries} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Tabs>
        </div>
    );
}
