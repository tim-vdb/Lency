"use client";

import { Card, CardContent, CardFooter } from "@/front/components/ui/card";
import { cn } from "@/front/lib/utils";
import { PostWithUserState } from "@/front/types/post.schema";
import { usePostState } from "@/front/hooks/use-post-state";
import Image from "next/image";
import CommentRoot from "../Comments/CommentRoot";
import Comments from "../Comments/Comments";
import PostAvatar from "./PostAvatar";
import PostActionsPopup from "./PostActionsPopup";
import PostActions from "./PostActions";

interface PostImageProps {
    post: PostWithUserState;
    className?: string;
}

export default function PostImage({ post, className }: PostImageProps) {
    const postState = usePostState(post);
    const { openComments } = postState;

    const imageSrc = post.imageUrl ?? "/images/blog/img1.jpg";
    const isPortrait = post.orientation === "PORTRAIT";

    /* Portrait: image left (9:16), content right */
    if (isPortrait) {
        return (
            <Card className={cn("overflow-hidden p-12", className)}>
                <CardContent className="p-0">
                    <div className="grid grid-cols-2">
                        <Image
                            src={imageSrc}
                            alt={post.content.slice(0, 60)}
                            width={320}
                            height={568}
                            className="w-full aspect-9/16 object-cover rounded-xl"
                            quality={100}
                        />
                        <div className="flex flex-col justify-between p-5 gap-4">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <PostAvatar post={post} className="pl-0 py-0" />
                                    <PostActionsPopup post={post} {...postState} />
                                </div>
                                <div className="flex items-center justify-between w-full">
                                    <PostActions post={post} {...postState} />
                                    {post.category && (
                                        <span className="text-xs font-medium px-3 py-1.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-md whitespace-nowrap">
                                            {post.category.name}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <hr className="h-0.5 bg-neutral-100 dark:border-neutral-800 mb-3" />
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-4">
                                        {post.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {openComments && (
                        <div className="px-5 pb-5">
                            <CommentRoot target={{ type: "post", id: post.id }} />
                            <p className="text-center text-sm font-semibold mt-2">
                                {post.commentCount} commentaire{post.commentCount !== 1 ? "s" : ""}
                            </p>
                            <div className="max-h-[500px] overflow-y-auto mt-2">
                                <Comments target={{ type: "post", id: post.id }} />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    }

    /* Landscape: image top, footer below */
    return (
        <Card className={cn("gap-4 p-12 flex-1", className)}>
            <CardContent className="relative">
                <div className="flex items-center justify-between bg-transparent z-10">
                    <PostAvatar post={post} className="pl-0" />
                    <PostActionsPopup post={post} {...postState} />
                </div>
                <Image
                    src={imageSrc}
                    alt={post.content.slice(0, 60)}
                    width={500}
                    height={500}
                    className="w-full h-auto rounded-xl"
                    quality={100}
                />
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2">
                <div className="flex items-center justify-between w-full">
                    <PostActions post={post} {...postState} />
                    {post.category && (
                        <span className="text-xs font-medium px-3 py-1.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-md whitespace-nowrap">
                            {post.category.name}
                        </span>
                    )}
                </div>
                <hr className="border-dashed border border-neutral-400 w-full" />
                <p className="text-sm text-neutral-500 line-clamp-2">{post.content}</p>
                {openComments && (
                    <>
                        <CommentRoot target={{ type: "post", id: post.id }} />
                        <p className="text-center text-sm font-semibold">
                            {post.commentCount} commentaire{post.commentCount !== 1 ? "s" : ""}
                        </p>
                        <div className="w-full max-h-[500px] overflow-y-auto">
                            <Comments target={{ type: "post", id: post.id }} />
                        </div>
                    </>
                )}
            </CardFooter>
        </Card>
    );
}
