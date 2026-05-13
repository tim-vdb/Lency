"use client";

import { Card, CardContent } from "@/front/components/ui/card";
import { cn } from "@/front/lib/utils";
import { PostWithUserState } from "@/front/types/post.schema";
import { usePostState } from "@/front/hooks/use-post-state";
import CommentRoot from "../Comments/CommentRoot";
import Comments from "../Comments/Comments";
import PostActions from "./PostActions";
import PostActionsPopup from "./PostActionsPopup";
import PostAvatar from "./PostAvatar";
import ExpandableText from "./ExpandableText";

interface PostTextProps {
    post: PostWithUserState;
    className?: string;
}

export default function PostText({ post, className }: PostTextProps) {
    const { category } = post;
    const postState = usePostState(post);
    const { openComments } = postState;

    return (
        <Card className={cn("relative p-12", className)}>
            <CardContent className="flex flex-col gap-3 px-0">
                <div className="flex items-center justify-between">
                    <PostAvatar post={post} className="pl-0 py-0" />
                    <PostActionsPopup post={post} {...postState} />
                </div>

                <ExpandableText content={post.content} lineClamp={3} />

                <div className="flex items-center justify-between">
                    <div className="flex flex-col w-full gap-3">
                        <hr className="h-0.5 bg-neutral-100 dark:border-neutral-800 w-1/5" />
                        <div className="flex items-center justify-between w-full">
                            <PostActions
                                post={post}
                                {...postState}
                            />

                            {category && (
                                <span className="text-xs font-medium px-3 py-1.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-md whitespace-nowrap">
                                    {category.name}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Comments */}
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
            </CardContent>
        </Card>
    );
}
