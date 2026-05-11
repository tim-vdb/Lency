"use client";

import { Card, CardContent, CardFooter } from "@/front/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/front/components/ui/popover";
import { Tooltip, TooltipContent } from "@/front/components/ui/tooltip";
import { useReportPost, useToggleSavePost, useToggleVotePost } from "@/front/hooks/queries/use-posts";
import { cn } from "@/front/lib/utils";
import { PostWithUserState } from "@/front/types/post.schema";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { Bookmark, Ellipsis, Flag, Heart, MessageCircleMore, Share } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CommentRoot from "../Comments/CommentRoot";
import Comments from "../Comments/Comments";
import PostAvatar from "./PostAvatar";
import { useRequireAuth } from "@/front/hooks/use-modals";
import { useShare } from "@/front/hooks/use-share";
import { IoArrowRedoOutline } from "react-icons/io5";
import { Button } from "@/front/components/ui/button";

interface PostImageProps {
    post: PostWithUserState;
    className?: string;
}

export default function PostImage({ post, className }: PostImageProps) {
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

    const imageSrc = post.imageUrl ?? "/images/blog/img1.jpg";
    const isPortrait = post.orientation === "PORTRAIT";

    const popoverMenu = (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                >
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

    const actionsBar = (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-0.5">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button onClick={(e) => { e.stopPropagation(); handleVote(); }}>
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
                            <button onClick={(e) => { e.stopPropagation(); handleSave(); }}>
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
                            <button onClick={(e) => { e.stopPropagation(); share(`/community/${post.category.slug}/post/${post.id}`, post.content.slice(0, 60)); }}>
                                <IoArrowRedoOutline className="w-5 h-5 text-neutral-500 dark:text-neutral-400 cursor-pointer" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent><p>Partager</p></TooltipContent>
                    </Tooltip>
                </div>
            </div>

            {post.category && (
                <span className="text-xs font-medium px-3 py-1.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-md whitespace-nowrap">
                    {post.category.name}
                </span>
            )}
        </div>
    );

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
                                    {popoverMenu}
                                </div>
                                {actionsBar}
                                <div>
                                    <hr className="border-neutral-200 dark:border-neutral-700 mb-3" />
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

    return (
        <Card className={cn("gap-4 p-12 flex-1", className)}>
            <CardContent className="relative">
                <div className="flex items-center justify-between bg-transparent z-10">
                    <PostAvatar post={post} className="pl-0" />
                    {popoverMenu}
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
                <div className="flex justify-between gap-4 w-full">
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
                    <Button>
                        {post.category.name}
                    </Button>
                </div>
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
                <hr className="border-dashed border border-neutral-400 w-full" />
                <p className="text-sm text-neutral-500 line-clamp-2">{post.content}</p>
            </CardFooter>
        </Card>
    );
}
