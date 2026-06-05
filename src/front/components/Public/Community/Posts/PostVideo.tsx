"use client";

import { Card, CardContent, CardFooter } from "@/front/components/ui/card";
import Link from "next/link";
import { cn } from "@/front/lib/utils";
import { PostWithUserState } from "@/front/schemas/types/post.type";
import { usePostState } from "@/front/hooks/use-post-state";
import CommentRoot from "../Comments/CommentRoot";
import Comments from "../Comments/Comments";
import PostAvatar from "./PostAvatar";
import PostActionsPopup from "./PostActionsPopup";
import PostActions from "./PostActions";
import ExpandableText from "./ExpandableText";
import { useVideoThumbnail } from "@/front/hooks/use-video-thumbnail";
import { Button } from "@/front/components/ui/button";
import { useRef, useState } from "react";
import { FaPlay } from "react-icons/fa";

interface PostVideoProps {
    post: PostWithUserState;
    className?: string;
    defaultOpenComments?: boolean;
    lockOpenComments?: boolean;
}

export default function PostVideo({ post, className, defaultOpenComments, lockOpenComments }: PostVideoProps) {
    const { category } = post;
    const postState = usePostState(post, { initialOpenComments: defaultOpenComments, lockOpenComments });
    const { openComments } = postState;

    const videoSrc = post.videoUrl;
    const isPortrait = post.orientation === "PORTRAIT";
    const { thumbnail, ready: thumbnailReady, failed: thumbnailFailed } = useVideoThumbnail(videoSrc);
    const showPlayOverlay = thumbnailReady && !thumbnailFailed;

    const portraitVideoRef = useRef<React.ComponentRef<"video">>(null);
    const landscapeVideoRef = useRef<React.ComponentRef<"video">>(null);
    const [portraitPlaying, setPortraitPlaying] = useState(false);
    const [landscapePlaying, setLandscapePlaying] = useState(false);

    /* Portrait: 2-col grid on md+, vertical stack below md */
    if (isPortrait) {
        return (
            <Card className={cn("overflow-hidden p-6 md:p-12", className)}>
                <CardContent className="p-0 flex flex-col gap-4">
                    {/* Avatar row — mobile only (above video) */}
                    <div className="flex items-center justify-between md:hidden">
                        <PostAvatar author={post.author} className="pl-0 py-0" />
                        <PostActionsPopup post={post} {...postState} />
                    </div>

                    <div className="flex flex-col md:grid md:grid-cols-2 gap-5">
                        <div className="relative">
                            {videoSrc ? (
                                <video
                                    ref={portraitVideoRef}
                                    src={videoSrc}
                                    controls
                                    poster={thumbnail ?? undefined}
                                    onPlay={() => setPortraitPlaying(true)}
                                    onPause={() => setPortraitPlaying(false)}
                                    onEnded={() => setPortraitPlaying(false)}
                                    className="w-full aspect-9/16 object-cover rounded-xl"
                                />
                            ) : (
                                <div className="w-full aspect-9/16 bg-neutral-200 dark:bg-neutral-800 rounded-xl flex items-center justify-center">
                                    <span className="text-base text-neutral-400">Aucune vidéo</span>
                                </div>
                            )}
                            {videoSrc && showPlayOverlay && !portraitPlaying && (
                                <button
                                    onClick={() => portraitVideoRef.current?.play()}
                                    className="absolute inset-0 flex items-center justify-center rounded-xl group/play"
                                    aria-label="Lire la vidéo"
                                >
                                    <span className="flex items-center justify-center w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm group-hover/play:bg-black/60 transition-colors cursor-pointer">
                                        <FaPlay className="w-6 h-6 text-white ml-1" />
                                    </span>
                                </button>
                            )}
                        </div>
                        <div className="flex flex-col justify-between gap-4">
                            {/* Avatar row — desktop only (inside right column) */}
                            <div className="flex flex-col justify-between gap-2">
                                <div className="hidden md:flex items-center justify-between">
                                    <PostAvatar author={post.author} className="pl-0 py-0" />
                                    <PostActionsPopup post={post} {...postState} />
                                </div>
                                <div className="flex items-center justify-between w-full">
                                    <PostActions post={post} {...postState} />
                                </div>
                                <hr className="h-0.5 bg-neutral-100 dark:border-neutral-800 w-2/4" />
                                <ExpandableText content={post.content} lineClamp={4} />
                            </div>
                            {category && (
                                <Button asChild variant="outline" className="w-fit ml-auto">
                                    <Link
                                        href={`/community/${category.slug}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-xs"
                                    >
                                        {category.name}
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>

                    {openComments && (
                        <div>
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

    /* Landscape: video top, footer below */
    return (
        <Card className={cn("p-6 sm:p-12", className)}>
            <CardContent className="flex flex-col relative gap-2 px-0">
                <div className="flex items-center justify-between bg-transparent z-10">
                    <PostAvatar author={post.author} className="pl-0" />
                    <PostActionsPopup post={post} {...postState} />
                </div>
                <div className="relative">
                    {videoSrc ? (
                        <video
                            ref={landscapeVideoRef}
                            src={videoSrc}
                            controls
                            poster={thumbnail ?? undefined}
                            onPlay={() => setLandscapePlaying(true)}
                            onPause={() => setLandscapePlaying(false)}
                            onEnded={() => setLandscapePlaying(false)}
                            className="w-full h-[450px] rounded-md object-cover"
                        />
                    ) : (
                        <div className="w-full h-[450px] rounded-md bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                            <span className="text-neutral-400">Aucune vidéo</span>
                        </div>
                    )}
                    {videoSrc && showPlayOverlay && !landscapePlaying && (
                        <button
                            onClick={() => landscapeVideoRef.current?.play()}
                            className="absolute inset-0 flex items-center justify-center rounded-md group/play"
                            aria-label="Lire la vidéo"
                        >
                            <span className="flex items-center justify-center w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm group-hover/play:bg-black/60 transition-colors cursor-pointer">
                                <FaPlay className="w-6 h-6 text-white ml-1" />
                            </span>
                        </button>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4 px-0">
                <div className="flex items-center justify-between w-full">
                    <PostActions post={post} {...postState} />
                    {category && (
                        <Button asChild variant="outline" className="w-fit ml-auto">
                            <Link
                                href={`/community/${category.slug}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-xs"
                            >
                                {category.name}
                            </Link>
                        </Button>
                    )}
                </div>
                <hr className="h-0.5 bg-neutral-100 dark:border-neutral-800 w-1/4" />
                <ExpandableText content={post.content} lineClamp={2} />
                {openComments && (
                    <>
                        <CommentRoot target={{ type: "post", id: post.id }} />
                        <div className="w-full max-h-[500px] overflow-y-auto">
                            <Comments target={{ type: "post", id: post.id }} />
                        </div>
                    </>
                )}
            </CardFooter>
        </Card>
    );
}
