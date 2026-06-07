"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Briefcase, MoreHorizontal } from "lucide-react"
import dayjs from "dayjs"
import { AdminDataTable, SortableHeader } from "@/front/components/Private/Admin/Shared/AdminDataTable"
import { AdminConfirmDelete } from "@/front/components/Private/Admin/Shared/AdminConfirmDelete"
import { useAdminProjects, usePatchAdminProject, useDeleteAdminProject } from "@/front/queries/admin-data"
import type { AdminProject } from "@/front/schemas/types/admin-data.type"
import { Badge } from "@/front/components/ui/badge"
import { Button } from "@/front/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/front/components/ui/avatar"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/front/components/ui/dropdown-menu"
import { getDisplayName, getInitialName, cn } from "@/front/lib/utils"

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
    PUBLISHED: { label: "Publié", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    DRAFT: { label: "Brouillon", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
    ARCHIVED: { label: "Archivé", className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
}

const VISIBILITY_CONFIG: Record<string, { label: string; className: string }> = {
    PUBLIC: { label: "Public", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    PRIVATE: { label: "Privé", className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
    MEMBERS_ONLY: { label: "Membres", className: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400" },
}

function StatusBadge({ value, config }: { value: string; config: Record<string, { label: string; className: string }> }) {
    const cfg = config[value] ?? { label: value, className: "" }
    return <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium", cfg.className)}>{cfg.label}</span>
}

interface ProjectActionsProps {
    project: AdminProject
    onDelete: (p: AdminProject) => void
    onPatch: (id: string, data: { status?: string; visibility?: string }) => void
}

function ProjectActions({ project, onDelete, onPatch }: ProjectActionsProps) {
    return (
        <div className="flex items-center gap-1">
            <Button
                variant="ghost" size="icon" className="size-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(project)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-7">
                        <MoreHorizontal className="size-3.5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel className="text-xs">Statut</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-xs" onSelect={() => onPatch(project.id, { status: "PUBLISHED" })}>Publier</DropdownMenuItem>
                    <DropdownMenuItem className="text-xs" onSelect={() => onPatch(project.id, { status: "DRAFT" })}>Brouillon</DropdownMenuItem>
                    <DropdownMenuItem className="text-xs" onSelect={() => onPatch(project.id, { status: "ARCHIVED" })}>Archiver</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs">Visibilité</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-xs" onSelect={() => onPatch(project.id, { visibility: "PUBLIC" })}>Public</DropdownMenuItem>
                    <DropdownMenuItem className="text-xs" onSelect={() => onPatch(project.id, { visibility: "PRIVATE" })}>Privé</DropdownMenuItem>
                    <DropdownMenuItem className="text-xs" onSelect={() => onPatch(project.id, { visibility: "MEMBERS_ONLY" })}>Membres</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export function ProjectsShell() {
    const { data: projects = [], isLoading } = useAdminProjects()
    const { mutate: patch } = usePatchAdminProject()
    const { mutate: del, isPending: deleting } = useDeleteAdminProject()

    const [deleteTarget, setDeleteTarget] = useState<AdminProject | null>(null)

    const columns: ColumnDef<AdminProject>[] = [
        {
            id: "title",
            accessorKey: "title",
            header: ({ column }) => <SortableHeader column={column} label="Titre" />,
            cell: ({ row }) => {
                const p = row.original
                return (
                    <div className="min-w-0 max-w-[280px]">
                        <p className="text-xs font-medium truncate">{p.title}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{p.subject}</p>
                    </div>
                )
            },
        },
        {
            id: "owner",
            header: "Propriétaire",
            cell: ({ row }) => {
                const owner = row.original.owner
                return (
                    <div className="flex items-center gap-2">
                        <Avatar className="size-5 shrink-0">
                            <AvatarImage src={owner.avatarUrl ?? ""} />
                            <AvatarFallback className="text-[9px]">{getInitialName(owner)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs truncate max-w-[120px]">{getDisplayName(owner)}</span>
                    </div>
                )
            },
        },
        {
            id: "status",
            accessorKey: "status",
            header: ({ column }) => <SortableHeader column={column} label="Statut" />,
            cell: ({ getValue }) => <StatusBadge value={getValue<string>()} config={STATUS_CONFIG} />,
        },
        {
            id: "visibility",
            accessorKey: "visibility",
            header: "Visibilité",
            cell: ({ getValue }) => <StatusBadge value={getValue<string>()} config={VISIBILITY_CONFIG} />,
        },
        {
            id: "applications",
            header: "Candidatures",
            accessorFn: (row) => row._count.applications,
            cell: ({ getValue }) => <span className="text-xs tabular-nums">{getValue<number>()}</span>,
        },
        {
            id: "participants",
            header: "Participants",
            accessorFn: (row) => row._count.participants,
            cell: ({ getValue }) => <span className="text-xs tabular-nums">{getValue<number>()}</span>,
        },
        {
            id: "comments",
            header: "Commentaires",
            accessorFn: (row) => row._count.comments,
            cell: ({ getValue }) => <span className="text-xs tabular-nums">{getValue<number>()}</span>,
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
                <ProjectActions
                    project={row.original}
                    onDelete={setDeleteTarget}
                    onPatch={(id, data) => patch({ id, ...data })}
                />
            ),
        },
    ]

    return (
        <>
            <AdminConfirmDelete
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                label={`le projet "${deleteTarget?.title ?? ""}"`}
                onConfirm={() => { if (deleteTarget) del(deleteTarget.id) }}
                isPending={deleting}
            />

            <div className="flex flex-col h-[calc(100vh-5rem)] rounded-xl border border-border bg-background shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                    <div className="flex items-center gap-2">
                        <Briefcase className="size-4 text-muted-foreground" />
                        <h1 className="text-sm font-semibold">Projets</h1>
                        <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{projects.length}</Badge>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-3 px-4 py-3 border-b border-border shrink-0">
                    {[
                        { label: "Total", value: projects.length },
                        { label: "Publiés", value: projects.filter(p => p.status === "PUBLISHED").length },
                        { label: "Brouillons", value: projects.filter(p => p.status === "DRAFT").length },
                        { label: "Archivés", value: projects.filter(p => p.status === "ARCHIVED").length },
                    ].map((s) => (
                        <div key={s.label} className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2">
                            <Briefcase className="size-3.5 text-muted-foreground shrink-0" />
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
                            data={projects}
                            columns={columns}
                            searchKey="title"
                            searchPlaceholder="Rechercher un projet..."
                        />
                    )}
                </div>
            </div>
        </>
    )
}
