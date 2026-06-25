"use client";

import { CreateResourceForm } from "@/front/components/Private/Global/CreateResourceForm";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/front/components/ui/alert-dialog";
import { Badge } from "@/front/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/front/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/front/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/front/components/ui/tooltip";
import { useUser } from "@/front/states/contexts/user.context";
import { useDeleteResource, useToggleSaveResource, useToggleVoteResource } from "@/front/queries/resources";
import { useRequireAuth } from "@/front/hooks/use-modals";
import { useShare } from "@/front/hooks/use-share";
import { cn, timeAgo } from "@/front/lib/utils";
import { ResourceWithUserState } from "@/front/schemas/types/resource.type";
import { Bookmark, ExternalLink, Heart, MessageCircleMore, MoreHorizontal, Music, Pencil, Play, Share, Trash2 } from "lucide-react";
import MediaLightbox, { MediaExpandOverlay } from "@/front/components/Public/Community/MediaLightbox";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import CommentRoot from "../Comments/CommentRoot";
import Comments from "../Comments/Comments";
import PostAvatar from "../Posts/PostAvatar";
import Link from "next/link";
import { useRouter } from "next/navigation";


type MediaAsset = { type: "image" | "video" | "audio"; url: string };

export default function ResourceDetail({ resource }: { resource: ResourceWithUserState }) {
    const href = `/community/${resource.category.slug}/resources/${resource.id}`;
    const requireAuth = useRequireAuth();
    const router = useRouter();
    const user = useUser();
    const [isVoted, setIsVoted] = useState(resource.isVoted);
    const [isSaved, setIsSaved] = useState(resource.isSaved);
    const share = useShare();
    const [upvoteCount, setUpvoteCount] = useState(resource.upvoteCount);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const { mutate: toggleVote } = useToggleVoteResource(resource.id, resource.categoryId);
    const { mutate: toggleSave } = useToggleSaveResource(resource.id, resource.categoryId);
    const { mutate: deleteResource, isPending: isDeleting } = useDeleteResource(resource.id, resource.categoryId);

    const isOwner = !!user && (user.id === resource.authorId || user.role === "ADMIN");

    function handleDelete() {
        deleteResource(undefined, {
            onSuccess: () => {
                toast.success("Ressource supprimée");
                setDeleteOpen(false);
                router.push(`/community/${resource.category.slug}`);
            },
            onError: (err) => toast.error(err.message),
        });
    }

    const mediaAssets: MediaAsset[] = [
        ...(resource.imageUrls ?? []).map((url) => ({ type: "image" as const, url })),
        ...(resource.videoUrls ?? []).map((url) => ({ type: "video" as const, url })),
        ...(resource.audioUrls ?? []).map((url) => ({ type: "audio" as const, url })),
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const activeAsset = mediaAssets[activeIndex];

    function handleVote() {
        requireAuth(() => {
            const prev = isVoted;
            setIsVoted(!prev);
            setUpvoteCount((c) => (prev ? c - 1 : c + 1));
            toggleVote(undefined, {
                onError: () => {
                    setIsVoted(prev);
                    setUpvoteCount((c) => (prev ? c + 1 : c - 1));
                },
            });
        });
    }

    function handleSave() {
        requireAuth(() => {
            const prev = isSaved;
            setIsSaved(!prev);
            toggleSave(undefined, {
                onSuccess: () => toast.success(!prev ? "Ressource enregistrée." : "Ressource retirée."),
                onError: () => setIsSaved(prev),
            });
        });
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <PostAvatar author={resource.author} />
                    <span className="text-xs text-neutral-400">• {timeAgo(resource.createdAt)}</span>
                </div>
                {isOwner && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors">
                                <MoreHorizontal className="size-4" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="bottom" align="end">
                            <DropdownMenuItem onClick={() => setEditOpen(true)}>
                                <Pencil className="size-3.5" />
                                Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => setDeleteOpen(true)}
                            >
                                <Trash2 className="size-3.5" />
                                Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            {/* ── Media gallery ── */}
            {mediaAssets.length > 0 && (
                <div className="flex flex-col gap-2">
                    {/* Main player */}
                    {activeAsset?.type === "image" && (
                        <MediaLightbox type="image" src={activeAsset.url} alt={resource.title}>
                            <div className="relative w-full h-80 rounded-xl overflow-hidden bg-linear-to-br from-pink-100 via-pink-50 to-rose-200 group">
                                <Image
                                    src={activeAsset.url}
                                    alt={resource.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 66vw"
                                    className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                                />
                                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-3 py-1 rounded-full flex items-center gap-3">
                                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{upvoteCount}</span>
                                    <span className="flex items-center gap-1"><MessageCircleMore className="w-3 h-3" />{resource.commentCount}</span>
                                </div>
                                <MediaExpandOverlay />
                            </div>
                        </MediaLightbox>
                    )}

                    {activeAsset?.type === "video" && (
                        <video
                            key={activeAsset.url}
                            src={activeAsset.url}
                            controls
                            className="w-full rounded-xl bg-black"
                            style={{ maxHeight: "420px" }}
                        />
                    )}

                    {activeAsset?.type === "audio" && (
                        <div className="w-full rounded-xl bg-neutral-950 px-6 py-8 flex flex-col items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                                <Music className="w-7 h-7 text-white/80" />
                            </div>
                            <audio key={activeAsset.url} src={activeAsset.url} controls className="w-full" />
                        </div>
                    )}

                    {/* Thumbnail strip — only shown when multiple assets */}
                    {mediaAssets.length > 1 && (
                        <div className="flex gap-2 pt-1">
                            {mediaAssets.map((asset, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setActiveIndex(i)}
                                    className={cn(
                                        "relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all duration-150",
                                        i === activeIndex
                                            ? "border-foreground"
                                            : "border-transparent opacity-60 hover:opacity-100"
                                    )}
                                >
                                    {asset.type === "image" && (
                                        <Image
                                            src={asset.url}
                                            alt=""
                                            fill
                                            sizes="80px"
                                            className="object-cover"
                                        />
                                    )}
                                    {asset.type === "video" && (
                                        <>
                                            <video
                                                src={asset.url}
                                                className="w-full h-full object-cover"
                                                muted
                                                playsInline
                                                preload="metadata"
                                            />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <Play className="w-4 h-4 text-white fill-white" />
                                            </div>
                                        </>
                                    )}
                                    {asset.type === "audio" && (
                                        <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                                            <Music className="w-5 h-5 text-white/70" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold">{resource.title}</h1>
                <Badge variant="secondary" className="text-xs font-medium">
                    <Link href={`/community/${resource.category.slug}`} className="hover:underline">
                        {resource.category.name}
                    </Link>
                </Badge>
            </div>

            {resource.description && (
                <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                    {resource.description}
                </p>
            )}

            {resource.urls?.length > 0 && (
                <div className="flex flex-col gap-1">
                    {resource.urls.map((url, i) => (
                        <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 underline w-fit"
                        >
                            <ExternalLink className="w-4 h-4 shrink-0" />
                            {url}
                        </a>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-4 pt-2 border-t border-neutral-200">
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Heart className={cn("w-6 h-6 cursor-pointer hover:text-red-500", isVoted && "fill-red-500 text-red-500")} onClick={(e) => { e.stopPropagation(); handleVote(); }} />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Aimer</p>
                        </TooltipContent>
                    </Tooltip>
                    <span>{upvoteCount}</span>
                </div>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Bookmark className={cn("w-6 h-6 cursor-pointer transition-colors", isSaved ? "fill-neutral-900 text-neutral-900" : "")} onClick={(e) => { e.stopPropagation(); handleSave(); }} />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Enregistrer</p>
                    </TooltipContent>
                </Tooltip>
                <div className="flex flex-col items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Share className="w-6 h-6 cursor-pointer" onClick={(e) => { e.stopPropagation(); share(href, resource.title); }} />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Partager</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>

            <div className="flex flex-col gap-4 pt-2">
                <CommentRoot target={{ type: "resource", id: resource.id }} />
                <Comments target={{ type: "resource", id: resource.id }} />
            </div>

            {/* ── Edit dialog ── */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="p-0 gap-0 w-full max-w-[820px] h-[600px] flex overflow-hidden rounded-xl">
                    <DialogTitle className="sr-only">Modifier la ressource</DialogTitle>
                    <DialogDescription className="sr-only">Formulaire de modification de la ressource</DialogDescription>
                    <CreateResourceForm
                        mode="edit"
                        initialData={resource}
                        onSuccess={() => setEditOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* ── Delete dialog ── */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer la ressource ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. La ressource &laquo;&nbsp;{resource.title}&nbsp;&raquo; sera définitivement supprimée.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >
                            {isDeleting ? "Suppression…" : "Supprimer"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
