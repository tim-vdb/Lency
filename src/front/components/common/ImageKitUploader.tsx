"use client";

import { upload } from "@imagekit/next";
import { ImageIcon, Loader2, Video, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

type MediaKind = "image" | "video";

interface MediaKitUploaderProps {
    value: string | null;
    onChange: (url: string | null) => void;
    kind?: MediaKind;
    folder?: string;
    disabled?: boolean;
}

const CONFIG: Record<MediaKind, {
    accept: string;
    mimePrefix: string;
    maxBytes: number;
    maxLabel: string;
    addLabel: string;
    sendingLabel: string;
    removeLabel: string;
    previewAlt: string;
    Icon: typeof ImageIcon;
}> = {
    image: {
        accept: "image/*",
        mimePrefix: "image/",
        maxBytes: 5 * 1024 * 1024,
        maxLabel: "5 Mo",
        addLabel: "Ajouter une image",
        sendingLabel: "Envoi...",
        removeLabel: "Retirer l'image",
        previewAlt: "Image du commentaire",
        Icon: ImageIcon,
    },
    video: {
        accept: "video/*",
        mimePrefix: "video/",
        maxBytes: 50 * 1024 * 1024,
        maxLabel: "50 Mo",
        addLabel: "Ajouter une vidéo",
        sendingLabel: "Envoi...",
        removeLabel: "Retirer la vidéo",
        previewAlt: "Vidéo du commentaire",
        Icon: Video,
    },
};

export default function ImageKitUploader({
    value,
    onChange,
    kind = "image",
    folder = "/comments",
    disabled,
}: MediaKitUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const config = CONFIG[kind];

    async function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;

        if (!file.type.startsWith(config.mimePrefix)) {
            toast.error(
                kind === "image"
                    ? "Seules les images sont acceptées."
                    : "Seules les vidéos sont acceptées."
            );
            return;
        }
        if (file.size > config.maxBytes) {
            toast.error(`Fichier trop volumineux (max ${config.maxLabel}).`);
            return;
        }

        setIsUploading(true);
        try {
            const authRes = await fetch("/api/imagekit/auth");
            if (!authRes.ok) throw new Error("Authentification upload échouée");
            const { signature, expire, token, publicKey } = await authRes.json();

            const uploaded = await upload({
                file,
                fileName: file.name,
                folder,
                signature,
                expire,
                token,
                publicKey,
            });

            if (!uploaded.url) throw new Error("URL manquante après upload");
            onChange(uploaded.url);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Échec de l'upload");
        } finally {
            setIsUploading(false);
        }
    }

    if (value) {
        return (
            <div className="relative inline-block">
                {kind === "image" ? (
                    <Image
                        src={value}
                        alt={config.previewAlt}
                        width={120}
                        height={120}
                        className="rounded-md object-cover border border-neutral-200"
                    />
                ) : (
                    <video
                        src={value}
                        controls
                        className="rounded-md border border-neutral-200 max-h-32"
                    />
                )}
                <button
                    type="button"
                    onClick={() => onChange(null)}
                    className="absolute -top-2 -right-2 bg-neutral-900 text-white rounded-full p-1 shadow hover:bg-neutral-700 transition-colors"
                    aria-label={config.removeLabel}
                >
                    <X className="w-3 h-3" />
                </button>
            </div>
        );
    }

    const { Icon } = config;

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept={config.accept}
                className="hidden"
                onChange={handleSelect}
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
                    <Icon className="w-3.5 h-3.5" />
                )}
                <span>{isUploading ? config.sendingLabel : config.addLabel}</span>
            </button>
        </>
    );
}
