"use client";

import { Card, CardContent } from "@/front/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/front/components/ui/popover";
import { cn } from "@/front/lib/utils";
import { Bookmark, Flag, Ellipsis, Heart, MessageCircleMore, Share } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { PostWithUserState } from "@/front/types/post.schema";
import { useToggleSavePost, useToggleVotePost, useReportPost } from "@/front/hooks/queries/use-posts";
import { toast } from "sonner";
import { Tooltip, TooltipContent } from "@/front/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { useRequireAuth } from "@/front/hooks/use-modals";
import { useShare } from "@/front/hooks/use-share";
import { IoArrowRedoOutline } from "react-icons/io5";
import CommentRoot from "../Comments/CommentRoot";
import Comments from "../Comments/Comments";

interface PostTextProps {
    post: PostWithUserState;
    className?: string;
}

export default function PostText({ post, className }: PostTextProps) {
    const { author, category } = post;
    const requireAuth = useRequireAuth();
    const share = useShare();
    const [expanded, setExpanded] = useState(false);
    const [openComments, setOpenComments] = useState(false);
    const [isVoted, setIsVoted] = useState(post.isVoted ?? false);
    const [isSaved, setIsSaved] = useState(post.isSaved ?? false);
    const [upvoteCount, setUpvoteCount] = useState(post.upvoteCount);

    useEffect(() => {
        setIsVoted(post.isVoted ?? false);
        setIsSaved(post.isSaved ?? false);
        setUpvoteCount(post.upvoteCount);
    }, [post.id]);

    const { mutate: toggleSavePost } = useToggleSavePost(post.id);
    const { mutate: toggleVotePost } = useToggleVotePost(post.id);
    const { mutate: report } = useReportPost(post.id);

    function handleVote() {
        requireAuth(() => {
            setIsVoted(!isVoted);
            setUpvoteCount((c) => !isVoted ? c + 1 : c - 1);
            toggleVotePost(undefined, {
                onError: () => {
                    setIsVoted(isVoted);
                    setUpvoteCount((c) => !isVoted ? c - 1 : c + 1);
                },
            });
        });
    }

    function handleSave() {
        requireAuth(() => {
            const nextSaved = !isSaved;
            setIsSaved(nextSaved);
            toggleSavePost(undefined, {
                onSuccess: () => toast.success(nextSaved ? "Post enregistré." : "Post retiré des enregistrements."),
                onError: () => setIsSaved(isSaved),
            });
        });
    }

    function handleReport() {
        requireAuth(() => {
            report(undefined, { onSuccess: () => toast.success("Post signalé.") });
        });
    }

    const menuItems = [
        {
            icon: Share,
            label: "Partager",
            filled: false,
            onClick: (e: React.MouseEvent) => { e.stopPropagation(); share(`/community/${post.category.slug}/post/${post.id}`, post.content.slice(0, 60)); },
        },
        {
            icon: Bookmark,
            label: isSaved ? "Enregistré" : "Enregistrer",
            filled: isSaved,
            onClick: (e: React.MouseEvent) => { e.stopPropagation(); handleSave(); },
        },
        {
            icon: Flag,
            label: "Signaler",
            className: "text-red-500",
            filled: false,
            onClick: (e: React.MouseEvent) => { e.stopPropagation(); handleReport(); },
        },
    ];

    const displayName = author.firstname && author.lastname
        ? `${author.firstname} ${author.lastname}`
        : author.username ?? "Anonyme";

    const initials = [
        author.firstname?.[0]?.toUpperCase(),
        author.lastname?.[0]?.toUpperCase(),
    ].filter(Boolean).join("") || "?";

    return (
        <Card className={cn("relative p-12", className)}>
            <CardContent className="flex flex-col gap-3 px-0">
                {/* Avatar + username */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {author.image ? (
                            <Image
                                src={author.image}
                                alt={displayName}
                                width={36}
                                height={36}
                                className="w-8 h-8 rounded-full shrink-0 object-cover"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-sm font-medium shrink-0">
                                {initials}
                            </div>
                        )}
                        <span className="text-sm font-semibold leading-tight">{displayName}</span>
                    </div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                                <Ellipsis className="w-5 h-5 text-neutral-500" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-44 p-1" align="end">
                            {menuItems.map(({ icon: Icon, label, className, onClick, filled }) => (
                                <button
                                    key={label}
                                    className={cn(
                                        "flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors",
                                        className
                                    )}
                                    onClick={onClick}
                                >
                                    <Icon className={cn("w-4 h-4", filled ? "fill-neutral-900 text-neutral-900" : "")} />
                                    {label}
                                </button>
                            ))}
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Text content */}
                <div>
                    <p className={cn("text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed", !expanded && "line-clamp-3")}>
                        {post.content}
                    </p>
                    {!expanded && (
                        <button
                            onClick={() => setExpanded(true)}
                            className="text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors mt-0.5"
                        >
                            Voir plus
                        </button>
                    )}
                </div>

                {/* Actions + category */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center gap-0.5">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button onClick={handleVote}>
                                        <Heart className={cn("w-5 h-5 transition-colors", isVoted ? "fill-red-500 text-red-500" : "text-neutral-500 dark:text-neutral-400")} />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent><p>Aimer</p></TooltipContent>
                            </Tooltip>
                            <span className="text-[10px] text-neutral-400">{upvoteCount}</span>
                        </div>
                        <div className="flex flex-col items-center gap-0.5">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button onClick={() => setOpenComments(!openComments)}>
                                        <MessageCircleMore className={cn("w-5 h-5 transition-colors", openComments ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-500 dark:text-neutral-400")} />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent><p>Commentaires</p></TooltipContent>
                            </Tooltip>
                            <span className="text-[10px] text-neutral-400">{post.commentCount}</span>
                        </div>
                        <div className="flex flex-col items-center gap-0.5">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button onClick={handleSave}>
                                        <Bookmark className={cn("w-5 h-5 transition-colors", isSaved ? "fill-neutral-900 text-neutral-900 dark:fill-neutral-100 dark:text-neutral-100" : "text-neutral-500 dark:text-neutral-400")} />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent><p>Enregistrer</p></TooltipContent>
                            </Tooltip>
                            <span className="text-[10px] text-neutral-400">{post.saveCount}</span>
                        </div>
                        <div className="flex flex-col items-center gap-0.5">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button onClick={() => share(`/community/${post.category.slug}/post/${post.id}`, post.content.slice(0, 60))}>
                                        <IoArrowRedoOutline className="w-5 h-5 text-neutral-500 dark:text-neutral-400 cursor-pointer" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent><p>Partager</p></TooltipContent>
                            </Tooltip>
                        </div>
                    </div>

                    {category && (
                        <span className="text-xs font-medium px-3 py-1.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-md whitespace-nowrap">
                            {category.name}
                        </span>
                    )}
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
