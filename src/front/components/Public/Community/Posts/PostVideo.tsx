"use client";

import { Card, CardContent, CardFooter } from "@/front/components/ui/card";
import { cn } from "@/front/lib/utils";
import { PostWithUserState } from "@/front/types/post.schema";
import { usePostState } from "@/front/hooks/use-post-state";
import CommentRoot from "../Comments/CommentRoot";
import Comments from "../Comments/Comments";
import PostAvatar from "./PostAvatar";
import PostActionsPopup from "./PostActionsPopup";
import PostActions from "./PostActions";
import ExpandableText from "./ExpandableText";
interface PostVideoProps {
    post: PostWithUserState;
    className?: string;
}

export default function PostVideo({ post, className }: PostVideoProps) {
    const { category } = post;
    const postState = usePostState(post);
    const { openComments } = postState;

    const videoSrc = post.videoUrl;
    const isPortrait = post.orientation === "PORTRAIT";

    /* Portrait: 2-col grid on md+, vertical stack below md */
    if (isPortrait) {
        return (
            <Card className={cn("overflow-hidden p-6 sm:p-12", className)}>
                <CardContent className="p-0 flex flex-col gap-4">
                    {/* Avatar row — mobile only (above video) */}
                    <div className="flex items-center justify-between sm:hidden">
                        <PostAvatar post={post} className="pl-0 py-0" />
                        <PostActionsPopup post={post} {...postState} />
                    </div>

                    <div className="flex flex-col sm:grid sm:grid-cols-2 gap-5">
                        {videoSrc ? (
                            <video
                                src={videoSrc}
                                controls
                                className="w-full aspect-9/16 object-cover rounded-xl"
                            />
                        ) : (
                            <div className="w-full aspect-9/16 bg-neutral-200 dark:bg-neutral-800 rounded-xl flex items-center justify-center">
                                <span className="text-xs text-neutral-400">Aucune vidéo</span>
                            </div>
                        )}
                        <div className="flex flex-col justify-between gap-4">
                            {/* Avatar row — desktop only (inside right column) */}
                            <div className="flex flex-col justify-between gap-2">
                                <div className="hidden sm:flex items-center justify-between">
                                    <PostAvatar post={post} className="pl-0 py-0" />
                                    <PostActionsPopup post={post} {...postState} />
                                </div>
                                <div className="flex items-center justify-between w-full">
                                    <PostActions post={post} {...postState} />
                                </div>
                                <hr className="h-0.5 bg-neutral-100 dark:border-neutral-800" />
                                <ExpandableText content={post.content} lineClamp={4} />
                            </div>
                            {category && (
                                <span className="text-xs w-fit ml-auto font-medium px-3 py-1.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-md whitespace-nowrap">
                                    {category.name}
                                </span>
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

    /* Landscape: video top, footer below */
    return (
        <Card className={cn("p-6 sm:p-12", className)}>
            <CardContent className="flex flex-col relative gap-2 px-0">
                <div className="flex items-center justify-between bg-transparent z-10">
                    <PostAvatar post={post} className="pl-0" />
                    <PostActionsPopup post={post} {...postState} />
                </div>
                {videoSrc ? (
                    <video
                        src={videoSrc}
                        controls
                        className="w-full h-[450px] rounded-md object-cover"
                    />
                ) : (
                    <div className="w-full h-[450px] rounded-md bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                        <span className="text-neutral-400">Aucune vidéo</span>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2 px-0">
                <div className="flex items-center justify-between w-full">
                    <PostActions post={post} {...postState} />
                    {category && (
                        <span className="text-xs font-medium px-3 py-1.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-md whitespace-nowrap">
                            {category.name}
                        </span>
                    )}
                </div>
                <hr className="border-dashed border border-neutral-400 w-full" />
                <ExpandableText content={post.content} lineClamp={2} />
                {openComments && (
                    <>
                        <CommentRoot target={{ type: "post", id: post.id }} />
                        <div className="w-full max-h-[500px] overflow-y-auto">
                            <Comments target={{ type: "post", id: post.id }} />
                        </div>
                    </>
                )}
            </CardFooter>
        </Card>
    );
}
