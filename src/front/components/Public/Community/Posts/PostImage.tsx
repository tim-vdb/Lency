"use client";

import { Card, CardContent, CardFooter } from "@/front/components/ui/card";
import { cn } from "@/front/lib/utils";
import { PostWithUserState } from "@/front/schemas/types/post.type";
import { usePostState } from "@/front/hooks/use-post-state";
import Image from "next/image";
import Link from "next/link";
import CommentRoot from "../Comments/CommentRoot";
import Comments from "../Comments/Comments";
import PostAvatar from "./PostAvatar";
import PostActionsPopup from "./PostActionsPopup";
import PostActions from "./PostActions";
import ExpandableText from "./ExpandableText";
import { Button } from "@/front/components/ui/button";
import MediaLightbox, { MediaExpandOverlay } from "@/front/components/Public/Community/MediaLightbox";

interface PostImageProps {
    post: PostWithUserState;
    className?: string;
    defaultOpenComments?: boolean;
    lockOpenComments?: boolean;
}

export default function PostImage({ post, className, defaultOpenComments, lockOpenComments }: PostImageProps) {
    const postState = usePostState(post, { initialOpenComments: defaultOpenComments, lockOpenComments });
    const { openComments } = postState;

    const imageSrc = post.imageUrl ?? "/images/blog/img1.jpg";
    const isPortrait = post.orientation === "PORTRAIT";

    if (isPortrait) {
        return (
            <Card className={cn("overflow-hidden p-6 md:p-12", className)}>
                <CardContent className="p-0 flex flex-col gap-4">
                    <div className="flex items-center justify-between md:hidden">
                        <PostAvatar author={post.author} className="pl-0 py-0" />
                        <PostActionsPopup post={post} {...postState} />
                    </div>

                    <div className="flex flex-col md:grid md:grid-cols-2 gap-5">
                        <MediaLightbox type="image" src={imageSrc} alt={post.content.slice(0, 60)}>
                            <div className="relative group">
                                <Image
                                    src={imageSrc}
                                    alt={post.content.slice(0, 60)}
                                    width={320}
                                    height={568}
                                    className="w-full aspect-9/16 object-cover rounded-xl"
                                    quality={100}
                                />
                                <MediaExpandOverlay />
                            </div>
                        </MediaLightbox>
                        <div className="flex flex-col justify-between gap-4">
                            <div className="flex flex-col justify-between gap-2">
                                <div className="hidden md:flex items-center justify-between">
                                    <PostAvatar author={post.author} className="pl-0 py-0 max-w-54" />
                                    <PostActionsPopup post={post} {...postState} />
                                </div>
                                <div className="flex items-center justify-between w-full">
                                    <PostActions post={post} {...postState} />
                                </div>
                                <hr className="h-0.5 bg-neutral-100 dark:border-neutral-800 w-2/4" />
                                <ExpandableText content={post.content} lineClamp={4} />
                            </div>
                            {post.category && (
                                <Button asChild variant="outline" className="w-fit ml-auto">
                                    <Link
                                        href={`/community/${post.category.slug}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-xs"
                                    >
                                        {post.category.name}
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>

                    {openComments && (
                        <div>
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
            <CardContent className="flex flex-col relative px-0 gap-2">
                <div className="flex items-center justify-between bg-transparent z-10">
                    <PostAvatar author={post.author} className="pl-0" />
                    <PostActionsPopup post={post} {...postState} />
                </div>
                <MediaLightbox type="image" src={imageSrc} alt={post.content.slice(0, 60)}>
                    <div className="relative group">
                        <Image
                            src={imageSrc}
                            alt={post.content.slice(0, 60)}
                            width={500}
                            height={500}
                            className="w-full h-auto rounded-xl"
                            quality={100}
                        />
                        <MediaExpandOverlay />
                    </div>
                </MediaLightbox>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4 px-0">
                <div className="flex items-center justify-between w-full">
                    <PostActions post={post} {...postState} />
                    {post.category && (
                        <Button asChild variant="outline" className="w-fit ml-auto">
                            <Link
                                href={`/community/${post.category.slug}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-xs"
                            >
                                {post.category.name}
                            </Link>
                        </Button>
                    )}
                </div>
                <hr className="h-0.5 bg-neutral-100 dark:border-neutral-800 w-1/4" />
                <ExpandableText content={post.content} lineClamp={2} />
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
