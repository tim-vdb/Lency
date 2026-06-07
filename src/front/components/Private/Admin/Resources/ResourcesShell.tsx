"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { BookOpen, Link, Package, Video, ThumbsUp, MessageSquare, Eye, Bookmark } from "lucide-react"
import dayjs from "dayjs"
import { AdminDataTable, SortableHeader } from "@/front/components/Private/Admin/Shared/AdminDataTable"
import { AdminConfirmDelete } from "@/front/components/Private/Admin/Shared/AdminConfirmDelete"
import { useAdminResources, useDeleteAdminResource } from "@/front/queries/admin-data"
import type { AdminResource } from "@/front/schemas/types/admin-data.type"
import { Badge } from "@/front/components/ui/badge"
import { Button } from "@/front/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/front/components/ui/avatar"
import { getDisplayName, getInitialName, cn } from "@/front/lib/utils"

const TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; className: string }> = {
    ASSET: { label: "Asset", icon: Package, className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
    TUTORIAL: { label: "Tutoriel", icon: Video, className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    LINK: { label: "Lien", icon: Link, className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
}

function ResourceDeleteButton({ resource, onDelete }: { resource: AdminResource; onDelete: (r: AdminResource) => void }) {
    return (
        <Button
            variant="ghost" size="icon" className="size-7 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(resource)}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        </Button>
    )
}

export function ResourcesShell() {
    const { data: resources = [], isLoading } = useAdminResources()
    const { mutate: del, isPending: deleting } = useDeleteAdminResource()

    const [deleteTarget, setDeleteTarget] = useState<AdminResource | null>(null)

    const columns: ColumnDef<AdminResource>[] = [
        {
            id: "title",
            accessorKey: "title",
            header: ({ column }) => <SortableHeader column={column} label="Titre" />,
            cell: ({ row }) => {
                const r = row.original
                return (
                    <div className="min-w-0 max-w-60">
                        <p className="text-xs font-medium truncate">{r.title}</p>
                        {r.description && <p className="text-[10px] text-muted-foreground truncate">{r.description}</p>}
                    </div>
                )
            },
        },
        {
            id: "type",
            accessorKey: "type",
            header: ({ column }) => <SortableHeader column={column} label="Type" />,
            cell: ({ getValue }) => {
                const type = getValue<string>()
                const cfg = TYPE_CONFIG[type] ?? { label: type, icon: BookOpen, className: "" }
                const Icon = cfg.icon
                return (
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", cfg.className)}>
                        <Icon className="size-3" />{cfg.label}
                    </span>
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
            id: "saveCount",
            accessorKey: "saveCount",
            header: ({ column }) => <SortableHeader column={column} label="Saves" />,
            cell: ({ getValue }) => (
                <div className="flex items-center gap-1 text-xs tabular-nums">
                    <Bookmark className="size-3 text-muted-foreground" />{getValue<number>()}
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
            id: "urls",
            header: "Liens",
            cell: ({ row }) => (
                <div className="flex flex-col gap-0.5">
                    {row.original.urls.slice(0, 2).map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 hover:underline truncate max-w-[120px]">{url}</a>
                    ))}
                    {row.original.urls.length > 2 && <span className="text-[10px] text-muted-foreground">+{row.original.urls.length - 2}</span>}
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
                <ResourceDeleteButton resource={row.original} onDelete={setDeleteTarget} />
            ),
        },
    ]

    const stats = [
        { label: "Total", value: resources.length, icon: BookOpen },
        { label: "Assets", value: resources.filter(r => r.type === "ASSET").length, icon: Package },
        { label: "Tutoriels", value: resources.filter(r => r.type === "TUTORIAL").length, icon: Video },
        { label: "Liens", value: resources.filter(r => r.type === "LINK").length, icon: Link },
    ]

    return (
        <>
            <AdminConfirmDelete
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                label={`la ressource "${deleteTarget?.title ?? ""}"`}
                onConfirm={() => { if (deleteTarget) del(deleteTarget.id) }}
                isPending={deleting}
            />

            <div className="flex flex-col h-[calc(100vh-5rem)] rounded-xl border border-border bg-background shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                    <div className="flex items-center gap-2">
                        <BookOpen className="size-4 text-muted-foreground" />
                        <h1 className="text-sm font-semibold">Ressources</h1>
                        <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{resources.length}</Badge>
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
                            data={resources}
                            columns={columns}
                            searchKey="title"
                            searchPlaceholder="Rechercher une ressource..."
                        />
                    )}
                </div>
            </div>
        </>
    )
}
