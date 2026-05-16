"use client"

import PostAudio from "@/front/components/Public/Community/Posts/PostAudio";
import PostImage from "@/front/components/Public/Community/Posts/PostImage";
import PostVideo from "@/front/components/Public/Community/Posts/PostVideo";
import PostText from "@/front/components/Public/Community/Posts/PostText";
import PostSkeleton, { PostImageSkeleton } from "@/front/components/Public/Community/Posts/PostSkeleton";
import ResourceCard from "@/front/components/Public/Community/Resources/ResourceCard";
import { Skeleton } from "@/front/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/front/components/ui/tabs";
import { useSavedPosts } from "@/front/hooks/queries/use-posts";
import { useSavedResources } from "@/front/hooks/queries/use-resources";
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

function ResourceListSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border overflow-hidden flex flex-col gap-3 py-3">
                    <Skeleton className="mx-3 h-40 rounded-md" />
                    <div className="px-4 flex flex-col gap-2">
                        <Skeleton className="h-3 w-3/4 rounded-md" />
                        <Skeleton className="h-3 w-1/2 rounded-md" />
                        <div className="flex items-center justify-between pt-1">
                            <Skeleton className="h-4 w-14 rounded-sm" />
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-3 w-8 rounded-md" />
                                <Skeleton className="h-3 w-8 rounded-md" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
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

export default function SavedPage() {
    const { data: posts, isPending: postsPending } = useSavedPosts();
    const { data: resources, isPending: resourcesPending } = useSavedResources();

    return (
        <div className="max-w-5xl mx-auto flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold">Enregistrés</h1>
                <p className="text-sm text-neutral-500">Vos posts et ressources sauvegardés</p>
            </div>

            <Tabs defaultValue="posts" className="flex flex-col gap-4 w-full">
                <TabsList className="w-fit justify-start p-0">
                    <TabsTrigger value="posts">Posts</TabsTrigger>
                    <TabsTrigger value="resources">Ressources</TabsTrigger>
                </TabsList>

                <TabsContent value="posts" className="flex flex-col gap-4 mt-0">
                    {postsPending && <PostListSkeleton />}
                    {!postsPending && posts?.length === 0 && (
                        <p className="text-neutral-500 text-sm">Aucun post enregistré.</p>
                    )}
                    {posts && posts.length > 0 && <PostList posts={posts} />}
                </TabsContent>

                <TabsContent value="resources" className="mt-0">
                    {resourcesPending && <ResourceListSkeleton />}
                    {!resourcesPending && resources?.length === 0 && (
                        <p className="text-neutral-500 text-sm">Aucune ressource enregistrée.</p>
                    )}
                    {resources && resources.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {resources.map((resource) => (
                                <ResourceCard key={resource.id} resource={resource} variant="grid" />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
