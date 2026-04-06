"use client"

import PostAudio from "@/front/components/Public/Community/Posts/PostAudio";
import PostDesktop from "@/front/components/Public/Community/Posts/PostDesktop";
import PostMobile from "@/front/components/Public/Community/Posts/PostMobile";
import PostText from "@/front/components/Public/Community/Posts/PostText";
import RecentlyViewed from "@/front/components/Public/Community/Sidebar/RecentlyViewed";
import { Button } from "@/front/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/front/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/front/components/ui/tabs"
import { usePosts } from "@/front/hooks/querys/use-posts"

export default function CommunityPage() {
    const { data: posts, isPending } = usePosts()

    return (
        <div>
            <Tabs defaultValue="general" className="flex flex-col gap-4 items-center justify-start">
                <TabsList className="w-md justify-evenly">
                    <TabsTrigger value="general">Général</TabsTrigger>
                    <TabsTrigger value="popular">Populaire</TabsTrigger>
                    <TabsTrigger value="following">Suivis</TabsTrigger>
                </TabsList>
                <div className="grid grid-cols-7 gap-2 w-full">
                    <TabsContent value="general" className="flex flex-col-reverse gap-4 mt-0 w-full col-span-5">
                        {isPending && <p>Chargement...</p>}
                        {posts && posts.length === 0 && <p>Aucun post trouvé.</p>}
                        {posts?.map((post) => (
                            <div key={post.id}>
                                {post.format === "DESKTOP" && <PostDesktop post={post} />}
                                {post.format === "MOBILE" && <PostMobile post={post} />}
                                {post.format === "AUDIO" && <PostAudio post={post} />}
                                {post.format === "TEXT" && <PostText post={post} />}
                            </div>
                        ))}
                    </TabsContent>
                    <TabsContent value="popular" className="mt-0 w-full col-span-4">

                    </TabsContent>
                    <TabsContent value="following" className="mt-0 w-full col-span-4">

                    </TabsContent>
                    <div className="col-start-6 col-span-2">
                        <Card className="sticky top-0.5 h-[calc(100vh-6rem)]">
                            <CardHeader className="flex items-center gap-2">
                                <CardTitle>Récemment vu</CardTitle>
                                <Button variant="outline" size="sm">Nettoyer</Button>
                            </CardHeader>
                            <CardContent>
                                <RecentlyViewed />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Tabs>
        </div>
    );
}