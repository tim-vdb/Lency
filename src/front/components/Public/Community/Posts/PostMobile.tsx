"use client";

import { Card, CardContent } from "@/front/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/front/components/ui/popover";
import { cn } from "@/front/lib/utils";
import { Download, Bookmark, EyeOff, Flag, Ellipsis, Heart, MessageCircleMore, Share } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { PostWithUserState } from "@/front/types/post.schema";
import { useToggleSavePost, useToggleVotePost, useHidePost, useReportPost } from "@/front/hooks/querys/use-posts";
import { toast } from "sonner";
import { Tooltip, TooltipContent } from "@/front/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

interface PostMobileProps {
    post: PostWithUserState;
    className?: string;
}

export default function PostMobile({ post, className }: PostMobileProps) {
    const { author, category } = post;
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
    const { mutate: hide } = useHidePost(post.id);
    const { mutate: report } = useReportPost(post.id);

    function handleVote() {
        setIsVoted(!isVoted);
        setUpvoteCount((c) => !isVoted ? c + 1 : c - 1);
        toggleVotePost(undefined, {
            onError: () => {
                setIsVoted(isVoted);
                setUpvoteCount((c) => !isVoted ? c - 1 : c + 1);
            },
        });
    }

    function handleSave() {
        const nextSaved = !isSaved;
        setIsSaved(nextSaved);
        toggleSavePost(undefined, {
            onSuccess: () => toast.success(nextSaved ? "Post enregistré." : "Post retiré des enregistrements."),
            onError: () => setIsSaved(isSaved),
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
            icon: EyeOff,
            label: "Pas intéressé",
            filled: false,
            onClick: (e: React.MouseEvent) => {
                e.stopPropagation();
                hide(undefined, { onSuccess: () => toast.success("Post masqué.") });
            },
        },
        {
            icon: Flag,
            label: "Signaler",
            className: "text-red-500",
            filled: false,
            onClick: (e: React.MouseEvent) => {
                e.stopPropagation();
                report(undefined, { onSuccess: () => toast.success("Post signalé.") });
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
        <Card className={cn("overflow-hidden", className)}>
            <CardContent className="flex">
                {/* Left: portrait image */}
                <div className="relative w-[45%] shrink-0">
                    <Image
                        src="/images/blog/img1.jpg"
                        alt={post.title}
                        width={300}
                        height={500}
                        className="w-full h-[500px] object-cover rounded-md"
                    />
                </div>

                {/* Right: content */}
                <div className="flex flex-col flex-1 p-3 gap-2 relative">
                    {/* Menu "..." top-right */}
                    <div className="absolute top-2 right-2">
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
                    <div className="flex items-center gap-2 pr-6">
                        {author.avatarUrl ? (
                            <Image
                                src={author.avatarUrl}
                                alt={displayName}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full shrink-0"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-xs font-medium shrink-0">
                                {initials}
                            </div>
                        )}
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium leading-tight truncate">{displayName}</span>
                            {category && (
                                <span className="text-xs text-neutral-400 leading-tight truncate">{category.name}</span>
                            )}
                        </div>
                    </div>

                    {/* Dashed separator */}
                    <hr className="border-dashed border-neutral-300 dark:border-neutral-600" />

                    {/* Action icons */}
                    <div className="flex items-center gap-3">
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
                                    <Share className="w-5 h-5 text-neutral-600 dark:text-neutral-300 cursor-pointer" />
                                </TooltipTrigger>
                                <TooltipContent><p>Partager</p></TooltipContent>
                            </Tooltip>
                        </div>
                    </div>

                    {/* Dashed separator */}
                    <hr className="border-dashed border-neutral-300 dark:border-neutral-600" />

                    {/* Text content */}
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-snug line-clamp-4">
                        {post.content}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
