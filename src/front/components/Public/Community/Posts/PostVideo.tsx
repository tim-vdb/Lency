"use client";

import { Card, CardContent, CardFooter } from "@/front/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/front/components/ui/popover";
import { cn } from "@/front/lib/utils";
import { Bookmark, Ellipsis, Flag, Heart, MessageCircleMore, Share } from "lucide-react";
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
import PostAvatar from "./PostAvatar";
import CommentRoot from "../Comments/CommentRoot";
import Comments from "../Comments/Comments";

interface PostVideoProps {
    post: PostWithUserState;
    className?: string;
}

export default function PostVideo({ post, className }: PostVideoProps) {
    const { author, category } = post;
    const requireAuth = useRequireAuth();
    const share = useShare();
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

    const videoSrc = post.videoUrl;
    const isPortrait = post.orientation === "PORTRAIT";

    const popoverMenu = (
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
    );

    if (isPortrait) {
        return (
            <Card className={cn("overflow-hidden", className)}>
                <CardContent className="flex p-0">
                    {/* Left: portrait video */}
                    <div className="relative w-[45%] shrink-0">
                        {videoSrc ? (
                            <video
                                src={videoSrc}
                                controls
                                className="w-full h-[500px] object-cover rounded-l-md"
                            />
                        ) : (
                            <div className="w-full h-[500px] bg-neutral-200 dark:bg-neutral-800 rounded-l-md flex items-center justify-center">
                                <span className="text-xs text-neutral-400">Aucune vidéo</span>
                            </div>
                        )}
                    </div>

                    {/* Right: content */}
                    <div className="flex flex-col flex-1 p-3 gap-2 relative h-[500px]">
                        <div className="absolute top-2 right-2">
                            {popoverMenu}
                        </div>

                        {/* Avatar + username + category */}
                        <div className="flex items-center gap-2 pr-6 shrink-0">
                            {author.image ? (
                                <Image
                                    src={author.image}
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

                        <hr className="border-dashed border-neutral-300 dark:border-neutral-600 shrink-0" />

                        {/* Actions */}
                        <div className="flex items-center gap-3 shrink-0">
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
                                        <button onClick={() => setOpenComments(!openComments)}>
                                            <MessageCircleMore className="w-5 h-5 text-neutral-600 dark:text-neutral-300 cursor-pointer" />
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
                                        <button onClick={() => share(`/community/${post.category.slug}/post/${post.id}`, post.content.slice(0, 60))}>
                                            <Share className="w-5 h-5 text-neutral-600 dark:text-neutral-300 cursor-pointer" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Partager</p></TooltipContent>
                                </Tooltip>
                            </div>
                        </div>

                        <hr className="border-dashed border-neutral-300 dark:border-neutral-600 shrink-0" />

                        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-snug line-clamp-4 shrink-0">
                            {post.content}
                        </p>

                        {openComments && (
                            <>
                                <div className="shrink-0">
                                    <CommentRoot target={{ type: "post", id: post.id }} />
                                </div>
                                <div className="flex-1 overflow-y-auto min-h-0">
                                    <Comments target={{ type: "post", id: post.id }} commentCount={post.commentCount} />
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={cn("gap-4 py-4 flex-1", className)}>
            <CardContent className="relative">
                <div className="flex items-center justify-between bg-transparent z-10">
                    <PostAvatar post={post} className="pl-0" />
                    {popoverMenu}
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
            <CardFooter className="flex flex-col items-start gap-2">
                <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Heart className={cn("w-7 h-7 cursor-pointer transition-colors", isVoted ? "fill-red-500 text-red-500" : "")} onClick={(e) => { e.stopPropagation(); handleVote(); }} />
                            </TooltipTrigger>
                            <TooltipContent><p>Aimer</p></TooltipContent>
                        </Tooltip>
                        <span className="text-xs text-neutral-500">{upvoteCount}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <MessageCircleMore className="w-7 h-7 cursor-pointer" onClick={() => setOpenComments(!openComments)} />
                            </TooltipTrigger>
                            <TooltipContent><p>Commentaires</p></TooltipContent>
                        </Tooltip>
                        <span className="text-xs text-neutral-500">{post.commentCount}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Bookmark className={cn("w-7 h-7 cursor-pointer transition-colors", isSaved ? "fill-neutral-900 text-neutral-900" : "")} onClick={(e) => { e.stopPropagation(); handleSave(); }} />
                            </TooltipTrigger>
                            <TooltipContent><p>Enregistrer</p></TooltipContent>
                        </Tooltip>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <IoArrowRedoOutline className="w-8 h-8 -translate-y-1 cursor-pointer" onClick={(e) => { e.stopPropagation(); share(`/community/${post.category.slug}/post/${post.id}`, post.content.slice(0, 60)); }} />
                            </TooltipTrigger>
                            <TooltipContent><p>Partager</p></TooltipContent>
                        </Tooltip>
                    </div>
                </div>
                <hr className="border-dashed border border-neutral-400 w-full" />
                <p className="text-sm text-neutral-500 line-clamp-2">{post.content}</p>
                {openComments && (
                    <>
                        <CommentRoot target={{ type: "post", id: post.id }} />
                        <div className="w-full max-h-[500px] overflow-y-auto">
                            <Comments target={{ type: "post", id: post.id }} commentCount={post.commentCount} />
                        </div>
                    </>
                )}
            </CardFooter>
        </Card>
    );
}
