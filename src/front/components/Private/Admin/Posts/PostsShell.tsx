"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { FileText, Eye, Lock, Unlock, CheckCircle, XCircle, MoreHorizontal, ThumbsUp, MessageSquare } from "lucide-react"
import dayjs from "dayjs"
import { AdminDataTable, SortableHeader } from "@/front/components/Private/Admin/Shared/AdminDataTable"
import { AdminConfirmDelete } from "@/front/components/Private/Admin/Shared/AdminConfirmDelete"
import { useAdminPosts, usePatchAdminPost, useDeleteAdminPost } from "@/front/queries/admin-data"
import type { AdminPost } from "@/front/schemas/types/admin-data.type"
import { Badge } from "@/front/components/ui/badge"
import { Button } from "@/front/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/front/components/ui/avatar"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/front/components/ui/dropdown-menu"
import { getDisplayName, getInitialName } from "@/front/lib/utils"

const FORMAT_LABELS: Record<string, string> = {
    TEXT: "Texte", IMAGE: "Image", VIDEO: "Vidéo", AUDIO: "Audio", DESKTOP: "Desktop", MOBILE: "Mobile",
}

interface PostActionsProps {
    post: AdminPost
    onDelete: (p: AdminPost) => void
    onPatch: (id: string, data: { isPublished?: boolean; isLocked?: boolean }) => void
}

function PostActions({ post, onDelete, onPatch }: PostActionsProps) {
    return (
        <div className="flex items-center gap-1">
            <Button
                variant="ghost" size="icon" className="size-7"
                title={post.isLocked ? "Déverrouiller" : "Verrouiller"}
                onClick={() => onPatch(post.id, { isLocked: !post.isLocked })}
            >
                {post.isLocked
                    ? <Unlock className="size-3.5 text-orange-500" />
                    : <Lock className="size-3.5 text-muted-foreground" />}
            </Button>
            <Button
                variant="ghost" size="icon" className="size-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(post)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" /></svg>
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-7">
                        <MoreHorizontal className="size-3.5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel className="text-xs">Visibilité</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-xs" onSelect={() => onPatch(post.id, { isPublished: true })}>
                        <CheckCircle className="size-3.5 mr-2 text-green-500" /> Publier
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs" onSelect={() => onPatch(post.id, { isPublished: false })}>
                        <XCircle className="size-3.5 mr-2 text-muted-foreground" /> Dépublier
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export function PostsShell() {
    const { data: posts = [], isLoading } = useAdminPosts()
    const { mutate: patch } = usePatchAdminPost()
    const { mutate: del, isPending: deleting } = useDeleteAdminPost()

    const [deleteTarget, setDeleteTarget] = useState<AdminPost | null>(null)

    const columns: ColumnDef<AdminPost>[] = [
        {
            id: "content",
            accessorKey: "content",
            header: "Contenu",
            cell: ({ row }) => {
                const p = row.original
                return (
                    <div className="max-w-[260px]">
                        <p className="text-xs truncate">{p.content}</p>
                        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded mt-0.5 inline-block">
                            {FORMAT_LABELS[p.format] ?? p.format}
                        </span>
                    </div>
                )
            },
        },
        {
            id: "author",
            header: "Auteur",
            cell: ({ row }) => {
                const author = row.original.author
                return (
                    <div className="flex items-center gap-2">
                        <Avatar className="size-5 shrink-0">
                            <AvatarImage src={author.avatarUrl ?? ""} />
                            <AvatarFallback className="text-[9px]">{getInitialName(author)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs truncate max-w-[100px]">{getDisplayName(author)}</span>
                    </div>
                )
            },
        },
        {
            id: "category",
            header: "Catégorie",
            accessorFn: (row) => row.category.name,
            cell: ({ row }) => <span className="text-xs text-muted-foreground">#{row.original.category.slug}</span>,
        },
        {
            id: "isPublished",
            accessorKey: "isPublished",
            header: "Publié",
            cell: ({ getValue }) => getValue<boolean>()
                ? <CheckCircle className="size-3.5 text-green-500" />
                : <XCircle className="size-3.5 text-muted-foreground" />,
        },
        {
            id: "isLocked",
            accessorKey: "isLocked",
            header: "Verrouillé",
            cell: ({ getValue }) => getValue<boolean>()
                ? <Lock className="size-3.5 text-orange-500" />
                : <span className="text-muted-foreground text-xs">—</span>,
        },
        {
            id: "upvoteCount",
            accessorKey: "upvoteCount",
            header: ({ column }) => <SortableHeader column={column} label="Votes" />,
            cell: ({ getValue }) => (
                <div className="flex items-center gap-1 text-xs tabular-nums">
                    <ThumbsUp className="size-3 text-muted-foreground" />{getValue<number>()}
                </div>
            ),
        },
        {
            id: "commentCount",
            accessorKey: "commentCount",
            header: ({ column }) => <SortableHeader column={column} label="Commentaires" />,
            cell: ({ getValue }) => (
                <div className="flex items-center gap-1 text-xs tabular-nums">
                    <MessageSquare className="size-3 text-muted-foreground" />{getValue<number>()}
                </div>
            ),
        },
        {
            id: "viewCount",
            accessorKey: "viewCount",
            header: ({ column }) => <SortableHeader column={column} label="Vues" />,
            cell: ({ getValue }) => (
                <div className="flex items-center gap-1 text-xs tabular-nums">
                    <Eye className="size-3 text-muted-foreground" />{getValue<number>()}
                </div>
            ),
        },
        {
            id: "createdAt",
            accessorKey: "createdAt",
            header: ({ column }) => <SortableHeader column={column} label="Créé le" />,
            cell: ({ getValue }) => <span className="text-xs text-muted-foreground">{dayjs(getValue<string>()).format("DD/MM/YYYY")}</span>,
        },
        {
            id: "actions",
            header: "",
            enableHiding: false,
            enableSorting: false,
            cell: ({ row }) => (
                <PostActions
                    post={row.original}
                    onDelete={setDeleteTarget}
                    onPatch={(id, data) => patch({ id, ...data })}
                />
            ),
        },
    ]

    const stats = [
        { label: "Total", value: posts.length, icon: FileText },
        { label: "Publiés", value: posts.filter(p => p.isPublished).length, icon: CheckCircle },
        { label: "Verrouillés", value: posts.filter(p => p.isLocked).length, icon: Lock },
        { label: "Non publiés", value: posts.filter(p => !p.isPublished).length, icon: XCircle },
    ]

    return (
        <>
            <AdminConfirmDelete
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                label="ce post"
                onConfirm={() => { if (deleteTarget) del(deleteTarget.id) }}
                isPending={deleting}
            />

            <div className="flex flex-col h-[calc(100vh-5rem)] rounded-xl border border-border bg-background shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                    <div className="flex items-center gap-2">
                        <FileText className="size-4 text-muted-foreground" />
                        <h1 className="text-sm font-semibold">Posts</h1>
                        <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{posts.length}</Badge>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-3 px-4 py-3 border-b border-border shrink-0">
                    {stats.map((s) => (
                        <div key={s.label} className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2">
                            <s.icon className="size-3.5 text-muted-foreground shrink-0" />
                            <div>
                                <p className="text-[10px] text-muted-foreground">{s.label}</p>
                                <p className="text-sm font-semibold tabular-nums">{isLoading ? "—" : s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex-1 overflow-hidden px-4 py-3">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Chargement...</div>
                    ) : (
                        <AdminDataTable
                            data={posts}
                            columns={columns}
                            searchKey="content"
                            searchPlaceholder="Rechercher dans les posts..."
                        />
                    )}
                </div>
            </div>
        </>
    )
}
