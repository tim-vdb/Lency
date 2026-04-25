"use client";

import { Card, CardContent } from "@/front/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/front/components/ui/popover";
import { cn } from "@/front/lib/utils";
import { Download, Bookmark, Flag, Ellipsis, Heart, MessageCircleMore, Share } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { PostWithUserState } from "@/front/types/post.schema";
import { useToggleSavePost, useToggleVotePost, useReportPost } from "@/front/hooks/queries/use-posts";
import { toast } from "sonner";
import { Tooltip, TooltipContent } from "@/front/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { useRequireAuth } from "@/front/hooks/use-modals";
import { useShare } from "@/front/hooks/use-share";

interface PostTextProps {
    post: PostWithUserState;
    className?: string;
}

export default function PostText({ post, className }: PostTextProps) {
    const { author, category } = post;
    const requireAuth = useRequireAuth();
    const share = useShare();
    const [expanded, setExpanded] = useState(false);
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
        { icon: Download, label: "Télécharger", filled: false, onClick: undefined },
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
            onClick: (e: React.MouseEvent) => {
                e.stopPropagation();
                handleReport();
            },
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
        <Card className={cn("relative", className)}>
            <CardContent className="flex flex-col gap-3">
                {/* Menu "..." top-right */}
                <div className="absolute top-3 right-3">
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

                {/* Avatar + username + category */}
                <div className="flex items-center gap-2 pr-8">
                    {author.avatarUrl ? (
                        <Image
                            src={author.avatarUrl}
                            alt={displayName}
                            width={36}
                            height={36}
                            className="w-9 h-9 rounded-full shrink-0"
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-sm font-medium shrink-0">
                            {initials}
                        </div>
                    )}
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium leading-tight">{displayName}</span>
                        {category && (
                            <span className="text-xs text-neutral-400 leading-tight">{category.name}</span>
                        )}
                    </div>
                </div>

                {/* Text content */}
                <p className={cn("text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed", !expanded && "line-clamp-3")}>
                    {post.content}{" "}
                    {!expanded && (
                        <button
                            onClick={() => setExpanded(true)}
                            className="text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                        >
                            ...plus
                        </button>
                    )}
                </p>

                {/* Actions — aligned right */}
                <div className="flex items-center gap-4 justify-end">
                    <div className="flex flex-col items-center gap-0.5">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button onClick={handleVote}>
                                    <Heart className={cn("w-5 h-5 transition-colors", isVoted ? "fill-red-500 text-red-500" : "text-neutral-600 dark:text-neutral-300")} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent><p>Aimer</p></TooltipContent>
                        </Tooltip>
                        <span className="text-[10px] text-neutral-400">{upvoteCount}</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <MessageCircleMore className="w-5 h-5 text-neutral-600 dark:text-neutral-300 cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent><p>Commentaires</p></TooltipContent>
                        </Tooltip>
                        <span className="text-[10px] text-neutral-400">{post.commentCount}</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button onClick={handleSave}>
                                    <Bookmark className={cn("w-5 h-5 transition-colors", isSaved ? "fill-neutral-900 text-neutral-900" : "text-neutral-600 dark:text-neutral-300")} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent><p>Enregistrer</p></TooltipContent>
                        </Tooltip>
                        <span className="text-[10px] text-neutral-400">{post.saveCount}</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Share className="w-5 h-5 text-neutral-600 dark:text-neutral-300 cursor-pointer" onClick={() => share(`/community/${post.category.slug}/post/${post.id}`, post.title)} />
                            </TooltipTrigger>
                            <TooltipContent><p>Partager</p></TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
