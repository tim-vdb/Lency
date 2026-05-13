"use client"

import { Card, CardContent } from "@/front/components/ui/card";
import { cn } from "@/front/lib/utils";
import { Play, Pause } from "lucide-react";
import { useRef, useState } from "react";
import { PostWithUserState } from "@/front/types/post.schema";
import { usePostState } from "@/front/hooks/use-post-state";
import CommentRoot from "../Comments/CommentRoot";
import Comments from "../Comments/Comments";
import PostActionsPopup from "./PostActionsPopup";
import PostActions from "./PostActions";
import PostAvatar from "./PostAvatar";
import ExpandableText from "./ExpandableText";

interface PostAudioProps {
    post: PostWithUserState;
    audioUrl?: string;
    className?: string;
}

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

function AudioPlayer({ audioUrl }: { audioUrl?: string }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);
    const [current, setCurrent] = useState(0);
    const [duration, setDuration] = useState(0);
    const [speed, setSpeed] = useState(1);

    const progress = duration > 0 ? (current / duration) * 100 : 0;

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (playing) {
            audio.pause();
        } else {
            audio.play();
        }
        setPlaying(!playing);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        setCurrent(val);
        if (audioRef.current) audioRef.current.currentTime = val;
    };

    const cycleSpeed = () => {
        const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
        const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
        setSpeed(next);
        if (audioRef.current) audioRef.current.playbackRate = next;
    };

    return (
        <div className="flex items-center gap-3 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 w-full bg-white dark:bg-neutral-900">
            {audioUrl && (
                <audio
                    ref={audioRef}
                    src={audioUrl}
                    onTimeUpdate={() => setCurrent(audioRef.current?.currentTime ?? 0)}
                    onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
                    onEnded={() => setPlaying(false)}
                />
            )}

            <button
                onClick={togglePlay}
                className="shrink-0 flex items-center justify-center w-8 h-8"
            >
                {playing
                    ? <Pause className="w-5 h-5 text-neutral-800 dark:text-neutral-200 fill-neutral-800 dark:fill-neutral-200" />
                    : <Play className="w-5 h-5 text-neutral-800 dark:text-neutral-200 fill-neutral-800 dark:fill-neutral-200" />
                }
            </button>

            <span className="text-[11px] text-neutral-400 shrink-0 tabular-nums">{formatTime(current)}</span>

            <div className="relative flex-1 h-5 flex items-center">
                <div className="absolute inset-x-0 h-[3px] rounded-full bg-neutral-200 dark:bg-neutral-600" />
                <div
                    className="absolute left-0 h-[3px] rounded-full bg-orange-400"
                    style={{ width: `${progress}%` }}
                />
                <input
                    type="range"
                    min={0}
                    max={duration || 1}
                    value={current}
                    onChange={handleSeek}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer h-5"
                />
                <div
                    className="absolute w-3 h-3 rounded-full bg-neutral-800 dark:bg-neutral-200 shadow -translate-x-1/2 pointer-events-none"
                    style={{ left: `${progress}%` }}
                />
            </div>

            <span className="text-[11px] text-neutral-400 shrink-0 tabular-nums">{formatTime(duration)}</span>

            <button
                onClick={cycleSpeed}
                className="shrink-0 text-[11px] font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors w-6 text-center"
            >
                x{speed}
            </button>
        </div>
    );
}

export default function PostAudio({ post, audioUrl, className }: PostAudioProps) {
    const { category } = post;
    const postState = usePostState(post);
    const { openComments } = postState;

    return (
        <Card className={cn("relative p-12", className)}>
            <CardContent className="flex flex-col gap-3 px-0">
                {/* Avatar + username */}
                <div className="flex items-center justify-between">
                    <PostAvatar post={post} className="pl-0 py-0" />
                    <PostActionsPopup post={post} {...postState} />
                </div>

                <ExpandableText content={post.content} lineClamp={3} />

                {/* Audio player */}
                <AudioPlayer audioUrl={audioUrl ?? post.audioUrl ?? undefined} />

                {/* Actions + category */}
                <div className="flex flex-col w-full gap-3">
                    <hr className="h-0.5 bg-neutral-100 dark:border-neutral-800 w-1/5" />
                    <div className="flex items-center justify-between w-full">
                        <PostActions post={post} {...postState} />
                        {category && (
                            <span className="text-xs font-medium px-3 py-1.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-md whitespace-nowrap">
                                {category.name}
                            </span>
                        )}
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
