"use client";

import { useRef, useState } from "react";
import { Paperclip, X, Music, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { uploadToImageKit } from "@/front/lib/upload";

export interface CommentMedia {
    imageUrls: string[];
    videoUrls: string[];
    audioUrls: string[];
}

interface CommentMediaUploaderProps {
    value: CommentMedia;
    onChange: (value: CommentMedia) => void;
    disabled?: boolean;
    folder?: string;
}

interface UploadingFile {
    id: string;
    kind: "image" | "video" | "audio";
    localUrl: string;
    name: string;
}

function detectKind(file: File): "image" | "video" | "audio" {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("audio/")) return "audio";
    return "video";
}

const SIZE_LIMITS: Record<"image" | "video" | "audio", number> = {
    image: 5 * 1024 * 1024,
    video: 50 * 1024 * 1024,
    audio: 20 * 1024 * 1024,
};

const SIZE_LABELS: Record<"image" | "video" | "audio", string> = {
    image: "5 Mo",
    video: "50 Mo",
    audio: "20 Mo",
};

export function CommentMediaUploader({
    value,
    onChange,
    disabled,
    folder = "/comments",
}: CommentMediaUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState<UploadingFile[]>([]);

    const allUploaded = [
        ...value.imageUrls.map(url => ({ kind: "image" as const, url })),
        ...value.videoUrls.map(url => ({ kind: "video" as const, url })),
        ...value.audioUrls.map(url => ({ kind: "audio" as const, url })),
    ];

    async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? []);
        e.target.value = "";
        if (!files.length) return;

        const newPending: UploadingFile[] = files.map(f => ({
            id: Math.random().toString(36).slice(2),
            kind: detectKind(f),
            localUrl: URL.createObjectURL(f),
            name: f.name,
        }));

        for (const [i, file] of files.entries()) {
            const kind = detectKind(file);
            if (file.size > SIZE_LIMITS[kind]) {
                toast.error(`${file.name} dépasse la limite (${SIZE_LABELS[kind]})`);
                continue;
            }
            const pending = newPending[i];
            setUploading(prev => [...prev, pending]);
            try {
                const url = await uploadToImageKit(file, folder);
                onChange({
                    imageUrls: kind === "image" ? [...value.imageUrls, url] : value.imageUrls,
                    videoUrls: kind === "video" ? [...value.videoUrls, url] : value.videoUrls,
                    audioUrls: kind === "audio" ? [...value.audioUrls, url] : value.audioUrls,
                });
            } catch {
                toast.error(`Échec de l'upload : ${file.name}`);
            } finally {
                setUploading(prev => prev.filter(p => p.id !== pending.id));
                URL.revokeObjectURL(pending.localUrl);
            }
        }
    }

    function remove(kind: "image" | "video" | "audio", url: string) {
        onChange({
            imageUrls: kind === "image" ? value.imageUrls.filter(u => u !== url) : value.imageUrls,
            videoUrls: kind === "video" ? value.videoUrls.filter(u => u !== url) : value.videoUrls,
            audioUrls: kind === "audio" ? value.audioUrls.filter(u => u !== url) : value.audioUrls,
        });
    }

    const isUploading = uploading.length > 0;
    const hasMedia = allUploaded.length > 0 || isUploading;

    return (
        <div className="flex flex-col gap-2">
            {hasMedia && (
                <div className="flex flex-wrap gap-2">
                    {allUploaded.map(({ kind, url }) => (
                        <div key={url} className="relative group/thumb">
                            {kind === "image" ? (
                                <Image
                                    src={url} alt=""
                                    width={64} height={64}
                                    className="h-16 w-16 rounded-lg object-cover border border-neutral-200"
                                />
                            ) : kind === "video" ? (
                                <video src={url} className="h-16 w-20 rounded-lg object-cover border border-neutral-200" />
                            ) : (
                                <div className="h-16 w-32 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center gap-1.5">
                                    <Music className="w-4 h-4 text-neutral-400" />
                                    <span className="text-[10px] text-neutral-500 truncate max-w-20">{url.split("/").pop()}</span>
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => remove(kind, url)}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-neutral-800 text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                    {uploading.map(pf => (
                        <div key={pf.id} className="h-16 w-16 rounded-lg border border-neutral-200 bg-neutral-50 flex items-center justify-center">
                            <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                        </div>
                    ))}
                </div>
            )}

            <div>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*,video/*,audio/*,video/webm"
                    multiple
                    className="hidden"
                    onChange={handleFiles}
                    disabled={disabled || isUploading}
                />
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={disabled || isUploading}
                    className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer disabled:opacity-50"
                >
                    {isUploading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                        <Paperclip className="w-3.5 h-3.5" />
                    )}
                    <span>{isUploading ? "Upload…" : "Ajouter un média"}</span>
                </button>
            </div>
        </div>
    );
}
