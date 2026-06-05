"use client"

import { Button } from '@/front/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/front/components/ui/card'
import { useFollowedCategoryPosts } from '@/front/queries/posts';
import { Compass } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link';

export default function PostsBlock() {
    const { data: posts, isPending } = useFollowedCategoryPosts()

    return (
        <Card className="flex flex-col shadow-none pt-2 pb-0 gap-2 2xl:gap-4 w-full overflow-hidden bg-transparent rounded-none">
            <CardHeader className="px-1">
                <div className="flex justify-between gap-1">
                    <div className='flex flex-col gap-2'>
                        <CardTitle className="2xl:text-xl">Communautés suivies</CardTitle>
                        <CardDescription className="text-xs 2xl:text-base max-w-xs line-clamp-2">
                            Découvrez les derniers posts de vos communautés que vous suivez
                        </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="border bg-neutral-300 cursor-pointer text-xs" asChild>
                        <Link href="/community">View All</Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pl-1 overflow-y-auto flex flex-col gap-4 pr-4">
                {isPending && (
                    <div className="flex flex-col gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-20 rounded-md bg-neutral-100 animate-pulse" />
                        ))}
                    </div>
                )}

                {!isPending && (!posts || posts.length === 0) && (
                    <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                            <Compass className="w-5 h-5 text-neutral-400" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium text-neutral-700">Aucune communauté suivie</p>
                            <p className="text-xs text-neutral-400 max-w-[200px]">
                                Rejoignez des catégories pour voir leurs posts ici.
                            </p>
                        </div>
                        <Button variant="outline" size="sm" className="text-xs" asChild>
                            <Link href="/community">
                                Découvrir des posts
                            </Link>
                        </Button>
                    </div>
                )}

                {posts && posts.length > 0 && posts.slice(0, 5).map((post) => (
                    <Link key={post.id} href={`/community/${post.category.slug}/post/${post.id}`}>
                        <Card className="border border-neutral-350 p-3 gap-1 shadow-lg-base hover:bg-neutral-50 transition-colors cursor-pointer">
                            <CardHeader className="flex justify-between gap-1 px-0 h-18 2xl:h-20">
                                <div className="flex flex-col gap-1 2xl:gap-2 px-0">
                                    <div>
                                        {post.category?.name && (
                                            <span className="text-[10px] text-neutral-500 mr-2 border px-0.5 py-1 rounded-sm">
                                                {post.category.name}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs font-medium text-neutral-800 line-clamp-1">{post.content}</p>
                                </div>
                                <Image
                                    src={"/images/blog/img1.jpg"}
                                    alt="Post"
                                    width={100}
                                    height={100}
                                    className="w-18 2xl:w-20 h-full 2xl:h-20 bg-contain rounded-md"
                                />
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </CardContent>
        </Card>
    )
}
