"use client";

import { Card, CardContent, CardFooter } from "@/front/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/front/components/ui/popover";
import PostAvatar from "./PostAvatar";
import { cn } from "@/front/lib/utils";
import { Download, Bookmark, EyeOff, Flag, Ellipsis, Heart, MessageCircleMore, Share } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { PostWithAuthorAndCategory } from "@/front/types/post.schema";
import { Item, ItemContent } from "@/front/components/ui/item";
import Comments from "../Comments/Comments";
import CommentRoot from "../Comments/CommentRoot";
import { useState } from "react";

interface PostDesktopProps {
    post: PostWithAuthorAndCategory;
    className?: string;
}

const menuItems = [
    { icon: Download, label: "Télécharger" },
    { icon: Bookmark, label: "Enregistrer" },
    { icon: EyeOff, label: "Pas intéressé" },
    { icon: Flag, label: "Signaler", className: "text-red-500" },
]

export default function PostDesktop({ post, className }: PostDesktopProps) {
    const [openComments, setOpenComments] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const isOnSelfPage = pathname === `/post/${post.id}`;
    const comments = post.commentCount

    return (
        <Card className={cn("gap-4 py-4 flex-1", className)}>
            <CardContent className="relative" onClick={() => !isOnSelfPage && router.push(`/post/${post.id}`)}>
                <div className="absolute top-2 w-[calc(100%-5rem)] translate-x-4 rounded-md flex items-center justify-between bg-transparent z-10">
                    <PostAvatar post={post} />
                    <Popover>
                        <PopoverTrigger asChild>
                            <button
                                className="p-1 rounded-md hover:bg-neutral-100 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Ellipsis className="w-6 h-6 text-neutral-500" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-44 p-1" align="end">
                            {menuItems.map(({ icon: Icon, label, className }) => (
                                <button
                                    key={label}
                                    className={cn(
                                        "flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-neutral-100 transition-colors",
                                        className
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </button>
                            ))}
                        </PopoverContent>
                    </Popover>
                </div>
                <Image src={"/images/blog/img1.jpg"} alt={post.title} width={500} height={500} className={cn("w-full h-[450px] object-cover rounded-md", !isOnSelfPage ? "cursor-pointer" : "")} />
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 pl-6">
                    <div className="flex flex-col gap-2">
                        <Heart className="w-6 h-6" />
                        <span className="text-xs text-neutral-500">123</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <MessageCircleMore className="w-6 h-6 cursor-pointer" onClick={() => {
                            setOpenComments(!openComments)

                        }} />
                        <span className="text-xs text-neutral-500">
                            {comments}
                        </span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Bookmark className="w-6 h-6" />
                        <span className="text-xs text-neutral-500">123</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Share className="w-6 h-6" />
                        <span className="text-xs text-neutral-500">123</span>
                    </div>
                </div>
                <hr className="border-dashed border border-neutral-400 w-full" />
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-sm text-neutral-500 line-clamp-2">{post.content}</p>
                {openComments && (
                    <div className="w-full">
                        <CommentRoot postId={post.id} />
                        <Comments postId={post.id} commentCount={post.commentCount} />
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}