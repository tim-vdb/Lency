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

interface PostDesktopProps {
    post: PostWithUserState;
    className?: string;
}

export default function PostDesktop({ post, className }: PostDesktopProps) {
    const requireAuth = useRequireAuth();
    const share = useShare();
    const [openComments, setOpenComments] = useState(false);
    const [isVoted, setIsVoted] = useState(post.isVoted ?? false);
    const [isSaved, setIsSaved] = useState(post.isSaved ?? false);
    const [upvoteCount, setUpvoteCount] = useState(post.upvoteCount);

    // Sync local state when navigating to a different post
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
            onClick: (e: React.MouseEvent) => { e.stopPropagation(); share(`/community/${post.category.slug}/post/${post.id}`, post.title); },
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
            onClick: (e: React.MouseEvent) => {
                e.stopPropagation();
                handleReport();
            },
        },
    ]

    return (
        <Card className={cn("gap-4 py-4 flex-1", className)}>
            <CardContent className="relative">
                <div className="flex items-center justify-between bg-transparent z-10">
                    <PostAvatar post={post} className="pl-0" />
                    <Popover>
                        <PopoverTrigger asChild>
                            <button
                                className="p-1 rounded-md hover:bg-neutral-100 transition-colors cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Ellipsis className="w-6 h-6 text-neutral-500" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-44 p-1" align="end">
                            {menuItems.map(({ icon: Icon, label, className, onClick, filled }) => (
                                <button
                                    key={label}
                                    className={cn(
                                        "flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-neutral-100 transition-colors",
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
                <Image src={"/images/blog/img1.jpg"} alt={post.title} width={500} height={500} className={cn("w-full h-[450px] object-cover rounded-md")} />
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2">
                <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Heart className={cn("w-7 h-7 cursor-pointer transition-colors", isVoted ? "fill-red-500 text-red-500" : "")} onClick={(e) => { e.stopPropagation(); handleVote(); }} />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Aimer</p>
                            </TooltipContent>
                        </Tooltip>
                        <span className="text-xs text-neutral-500">{upvoteCount}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <MessageCircleMore className="w-7 h-7 cursor-pointer" onClick={() => setOpenComments(!openComments)} />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Commentaires</p>
                            </TooltipContent>
                        </Tooltip>
                        <span className="text-xs text-neutral-500">
                            {post.commentCount}
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Bookmark className={cn("w-7 h-7 cursor-pointer transition-colors", isSaved ? "fill-neutral-900 text-neutral-900" : "")} onClick={(e) => { e.stopPropagation(); handleSave(); }} />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Enregistrer</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <IoArrowRedoOutline className="w-8 h-8 -translate-y-1 cursor-pointer" onClick={(e) => { e.stopPropagation(); share(`/community/${post.category.slug}/post/${post.id}`, post.title); }} />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Partager</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
                <hr className="border-dashed border border-neutral-400 w-full" />
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-sm text-neutral-500 line-clamp-2">{post.content}</p>
                {openComments && (
                    <div className="w-full">
                        <CommentRoot target={{ type: "post", id: post.id }} />
                        <Comments target={{ type: "post", id: post.id }} commentCount={post.commentCount} />
                    </div>
                )}
            </CardFooter>
        </Card >
    );
}
