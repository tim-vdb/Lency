"use client";

import { Card, CardContent } from "@/front/components/ui/card";
import { cn } from "@/front/lib/utils";
import Link from "next/link";
import { PostWithUserState } from "@/front/types/post.schema";
import { usePostState } from "@/front/hooks/use-post-state";
import CommentRoot from "../Comments/CommentRoot";
import Comments from "../Comments/Comments";
import PostActions from "./PostActions";
import PostActionsPopup from "./PostActionsPopup";
import PostAvatar from "./PostAvatar";
import ExpandableText from "./ExpandableText";
import { useViewportRecentlyViewed } from "@/front/hooks/use-viewport-recently-viewed";
import { Button } from "@/front/components/ui/button";

interface PostTextProps {
    post: PostWithUserState;
    className?: string;
    defaultOpenComments?: boolean;
    lockOpenComments?: boolean;
    viewDelay?: number;
}

export default function PostText({ post, className, defaultOpenComments, lockOpenComments, viewDelay = 60_000 }: PostTextProps) {
    const { category } = post;
    const postState = usePostState(post, { initialOpenComments: defaultOpenComments, lockOpenComments });
    const { openComments } = postState;
    const cardRef = useViewportRecentlyViewed(post, viewDelay);

    return (
        <Card ref={cardRef} className={cn("relative p-12", className)}>
            <CardContent className="flex flex-col gap-3 px-0">
                <div className="flex items-center justify-between">
                    <PostAvatar author={post.author} className="pl-0 py-0" />
                    <PostActionsPopup post={post} {...postState} />
                </div>

                <ExpandableText content={post.content} lineClamp={3} />

                <div className="flex items-center justify-between">
                    <div className="flex flex-col w-full gap-3">
                        <hr className="h-0.5 bg-neutral-100 dark:border-neutral-800 w-1/4" />
                        <div className="flex items-center justify-between w-full">
                            <PostActions
                                post={post}
                                {...postState}
                            />

                            <Button asChild variant="outline" className="w-fit ml-auto">
                                <Link
                                    href={`/community/${category.slug}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-xs"
                                >
                                    {category.name}
                                </Link>
                            </Button>
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
