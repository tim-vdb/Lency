"use client"

import { Card, CardContent } from "@/front/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/front/components/ui/popover";
import { cn } from "@/front/lib/utils";
import { Download, Bookmark, EyeOff, Flag, Ellipsis, Heart, MessageCircleMore, Share, Play, Pause } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { PostWithAuthorAndCategory } from "@/front/types/post.schema";
interface PostAudioProps {
    post: PostWithAuthorAndCategory;
    audioUrl?: string;
    className?: string;
}

const menuItems = [
    { icon: Download, label: "Télécharger" },
    { icon: Bookmark, label: "Enregistrer" },
    { icon: EyeOff, label: "Pas intéressé" },
    { icon: Flag, label: "Signaler", className: "text-red-500" },
]

const actionItems = [
    { icon: Heart, key: "likes" as const },
    { icon: MessageCircleMore, key: "comments" as const },
    { icon: Bookmark, key: "bookmarks" as const },
    { icon: Share, key: "shares" as const },
]

const MOCK_COUNTS = { likes: 1263, comments: 67, bookmarks: 28, shares: 34 }

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

function AudioPlayer({ audioUrl }: { audioUrl?: string }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);
    const [current, setCurrent] = useState(5);
    const [duration, setDuration] = useState(85);

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

    return (
        <div className="flex items-center gap-3 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 min-w-[220px]">
            {audioUrl && (
                <audio
                    ref={audioRef}
                    src={audioUrl}
                    onTimeUpdate={() => setCurrent(audioRef.current?.currentTime ?? 0)}
                    onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 85)}
                    onEnded={() => setPlaying(false)}
                />
            )}

            {/* Slider + timestamps */}
            <div className="flex flex-col flex-1 gap-1">
                <div className="relative w-full h-4 flex items-center">
                    <div className="absolute inset-x-0 h-[3px] rounded-full bg-neutral-200 dark:bg-neutral-600" />
                    <div
                        className="absolute left-0 h-[3px] rounded-full bg-neutral-800 dark:bg-neutral-200"
                        style={{ width: `${progress}%` }}
                    />
                    <input
                        type="range"
                        min={0}
                        max={duration}
                        value={current}
                        onChange={handleSeek}
                        className="absolute inset-0 w-full opacity-0 cursor-pointer h-4"
                    />
                    {/* Handle */}
                    <div
                        className="absolute w-3 h-3 rounded-full bg-neutral-800 dark:bg-neutral-200 shadow -translate-x-1/2"
                        style={{ left: `${progress}%` }}
                    />
                </div>
                <div className="flex justify-between">
                    <span className="text-[10px] text-neutral-400">{formatTime(current)}</span>
                    <span className="text-[10px] text-neutral-400">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Play / Pause button */}
            <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-lg border border-neutral-200 dark:border-neutral-600 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors shrink-0"
            >
                {playing
                    ? <Pause className="w-4 h-4 text-neutral-700 dark:text-neutral-200" />
                    : <Play className="w-4 h-4 text-neutral-700 dark:text-neutral-200" />
                }
            </button>
        </div>
    );
}

export default function PostAudio({ post, audioUrl, className }: PostAudioProps) {
    const { author, category } = post;
    const [expanded, setExpanded] = useState(false);

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
                            {menuItems.map(({ icon: Icon, label, className }) => (
                                <button
                                    key={label}
                                    className={cn(
                                        "flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors",
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

                {/* Body: text left + audio player right */}
                <div className="flex items-center gap-4">
                    <p className={cn("text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed flex-1", !expanded && "line-clamp-3")}>
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
                    <AudioPlayer audioUrl={audioUrl} />
                </div>

                {/* Actions — aligned right */}
                <div className="flex items-center gap-4 justify-end">
                    {actionItems.map(({ icon: Icon, key }) => (
                        <div key={key} className="flex flex-col items-center gap-0.5">
                            <Icon className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
                            <span className="text-[10px] text-neutral-400">{MOCK_COUNTS[key]}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
