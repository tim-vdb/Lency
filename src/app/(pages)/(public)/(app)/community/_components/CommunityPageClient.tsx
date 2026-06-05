"use client";

import PostAudio from "@/front/components/Public/Community/Posts/PostAudio";
import PostImage from "@/front/components/Public/Community/Posts/PostImage";
import PostVideo from "@/front/components/Public/Community/Posts/PostVideo";
import PostText from "@/front/components/Public/Community/Posts/PostText";
import PostSkeleton, { PostImageSkeleton } from "@/front/components/Public/Community/Posts/PostSkeleton";
import RecentlyViewedSidebar from "@/front/components/Public/Community/Sidebar/RecentlyViewed/RecentlyViewedSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/front/components/ui/tabs";
import { useFollowedCategoryPosts, usePosts } from "@/front/queries/posts";
import { useMemo } from "react";
import type { PostWithUserState } from "@/front/schemas/types/post.type";

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
                                    Vous ne suivez aucune catégorie. Rejoignez des catégories pour voir leurs posts ici.
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
