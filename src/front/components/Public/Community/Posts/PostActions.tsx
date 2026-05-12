"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/front/components/ui/tooltip";
import { cn } from "@/front/lib/utils";
import { Bookmark, Heart, MessageCircleMore } from "lucide-react";
import { IoArrowRedoOutline } from "react-icons/io5";
import { PostWithUserState } from "@/front/types/post.schema";
import { useRequireAuth } from "@/front/hooks/use-modals";
import { useShare } from "@/front/hooks/use-share";
import { useToggleSavePost, useToggleVotePost } from "@/front/hooks/queries/use-posts";

interface PostActionsProps {
    post: PostWithUserState;
    isVoted: boolean;
    isSaved: boolean;
    openComments: boolean;
    upvoteCount: number;
    setIsVoted: (value: boolean) => void;
    setUpvoteCount: (value: number | ((prev: number) => number)) => void;
    setOpenComments: (value: boolean) => void;
    setIsSaved: (value: boolean) => void;
}

export default function PostActions({
    post,
    isVoted,
    isSaved,
    openComments,
    upvoteCount,
    setIsVoted,
    setUpvoteCount,
    setOpenComments,
    setIsSaved,
}: PostActionsProps) {
    const { mutate: toggleVotePost } = useToggleVotePost(post.id);
    const { mutate: toggleSavePost } = useToggleSavePost(post.id);
    const requireAuth = useRequireAuth();
    const share = useShare();

    function handleVote() {
        requireAuth(() => {
            const nextVoted = !isVoted;
            setIsVoted(nextVoted);
            setUpvoteCount((c) => nextVoted ? c + 1 : c - 1);
            toggleVotePost(undefined, {
                onError: () => {
                    setIsVoted(isVoted);
                    setUpvoteCount((c) => nextVoted ? c - 1 : c + 1);
                },
            });
        });
    }

    function handleSave() {
        requireAuth(() => {
            const nextSaved = !isSaved;
            setIsSaved(nextSaved);
            toggleSavePost();
        });
    }

    function handleShare() {
        share(`/community/${post.category.slug}/post/${post.id}`, post.content.slice(0, 60));
    }

    return (
        <div className="flex items-start gap-4">
            {/* Like action */}
            <div className="flex flex-col items-center gap-0.5">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button onClick={handleVote} className="transition-transform hover:scale-110">
                            <Heart
                                className={cn(
                                    "w-7 h-7 cursor-pointer transition-colors",
                                    isVoted ? "fill-red-500 text-red-500" : "text-neutral-500 dark:text-neutral-400"
                                )}
                            />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent><p>Aimer</p></TooltipContent>
                </Tooltip>
                <span className="text-xs text-neutral-400">{upvoteCount}</span>
            </div>

            {/* Comments action */}
            <div className="flex flex-col items-center gap-0.5">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={() => setOpenComments(!openComments)}
                            className="transition-transform hover:scale-110"
                        >
                            <MessageCircleMore
                                className={cn(
                                    "w-7 h-7 cursor-pointer transition-colors",
                                    openComments ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-500 dark:text-neutral-400"
                                )}
                            />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent><p>Commentaires</p></TooltipContent>
                </Tooltip>
                <span className="text-xs text-neutral-400">{post.commentCount}</span>
            </div>

            {/* Bookmark action */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <button onClick={handleSave} className="transition-transform hover:scale-110">
                        <Bookmark
                            className={cn(
                                "w-7 h-7 cursor-pointer transition-colors",
                                isSaved
                                    ? "fill-neutral-900 text-neutral-900 dark:fill-neutral-100 dark:text-neutral-100"
                                    : "text-neutral-500 dark:text-neutral-400"
                            )}
                        />
                    </button>
                </TooltipTrigger>
                <TooltipContent><p>Enregistrer</p></TooltipContent>
            </Tooltip>

            {/* Share action */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <button onClick={handleShare} className="transition-transform hover:scale-110">
                        <IoArrowRedoOutline className="w-8 h-8 cursor-pointer -translate-y-1 text-neutral-500 dark:text-neutral-400" />
                    </button>
                </TooltipTrigger>
                <TooltipContent><p>Partager</p></TooltipContent>
            </Tooltip>
        </div>
    );
}