"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Users, Shield, CheckCircle, XCircle, MoreHorizontal } from "lucide-react"
import dayjs from "dayjs"
import Link from "next/link"
import { AdminDataTable, SortableHeader } from "@/front/components/Private/Admin/Shared/AdminDataTable"
import { AdminConfirmDelete } from "@/front/components/Private/Admin/Shared/AdminConfirmDelete"
import { useAdminUsers, usePatchAdminUser, useDeleteAdminUser } from "@/front/queries/admin-data"
import type { AdminUser } from "@/front/schemas/types/admin-data.type"
import { Badge } from "@/front/components/ui/badge"
import { Button } from "@/front/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/front/components/ui/avatar"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/front/components/ui/dropdown-menu"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/front/components/ui/dialog"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/front/components/ui/select"
import { getDisplayName, getInitialName, cn } from "@/front/lib/utils"

const ROLE_COLORS: Record<string, string> = {
    ADMIN: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    USER: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    MEMBER: "bg-gray-100 text-neutral-600 dark:bg-gray-800 dark:text-neutral-400",
}

// ─── Dialogs rendus UNE SEULE FOIS au niveau du shell ────────────────────────

function RoleDialog({ user, open, onClose }: { user: AdminUser | null; open: boolean; onClose: () => void }) {
    const { mutate, isPending } = usePatchAdminUser()
    if (!user) return null
    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Changer le rôle</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-3 pt-2">
                    <p className="text-sm text-muted-foreground">Rôle de <strong>{getDisplayName(user)}</strong></p>
                    <Select
                        defaultValue={user.role}
                        onValueChange={(role) => mutate({ id: user.id, role }, { onSuccess: onClose })}
                        disabled={isPending}
                    >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="MEMBER">Membre</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// ─── Actions en ligne — PAS de dialog ni d'état local ────────────────────────

interface UserActionsProps {
    user: AdminUser
    onRoleEdit: (user: AdminUser) => void
    onDelete: (user: AdminUser) => void
}

function UserActions({ user, onRoleEdit, onDelete }: UserActionsProps) {
    const { mutate: _patch } = usePatchAdminUser()

    return (
        <div className="flex items-center gap-1">
            <Button
                variant="ghost" size="icon" className="size-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(user)}
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
                    <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-xs" onSelect={() => onRoleEdit(user)}>
                        <Shield className="size-3.5 mr-2" /> Changer le rôle
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export function UsersShell() {
    const { data: users = [], isLoading } = useAdminUsers()
    const { mutate: del, isPending: deleting } = useDeleteAdminUser()

    const [roleTarget, setRoleTarget] = useState<AdminUser | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null)

    const columns: ColumnDef<AdminUser>[] = [
        {
            id: "user",
            accessorFn: (row) => getDisplayName(row),
            header: "Utilisateur",
            cell: ({ row }) => {
                const u = row.original
                return (
                    <Link href={`/user/${u.username ?? u.id}`} target="_blank" className="flex items-center gap-2.5 min-w-0 group">
                        <Avatar className="size-7 shrink-0">
                            <AvatarImage src={u.image ?? u.avatarUrl ?? ""} />
                            <AvatarFallback className="text-[10px]">{getInitialName(u)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <p className="text-xs font-medium truncate group-hover:underline">{getDisplayName(u)}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
                        </div>
                    </Link>
                )
            },
        },
        {
            id: "username",
            accessorKey: "username",
            header: "Pseudo",
            cell: ({ getValue }) => <span className="text-xs text-muted-foreground">@{getValue<string>() ?? "—"}</span>,
        },
        {
            id: "role",
            accessorKey: "role",
            header: ({ column }) => <SortableHeader column={column} label="Rôle" />,
            cell: ({ getValue }) => {
                const role = getValue<string>()
                const labels: Record<string, string> = { ADMIN: "Admin", USER: "Utilisateur", MEMBER: "Membre" }
                return <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium", ROLE_COLORS[role] ?? ROLE_COLORS.MEMBER)}>{labels[role] ?? role}</span>
            },
        },
        {
            id: "emailVerified",
            accessorKey: "emailVerified",
            header: "Email vérifié",
            cell: ({ getValue }) => getValue<boolean>()
                ? <CheckCircle className="size-3.5 text-green-500" />
                : <XCircle className="size-3.5 text-muted-foreground" />,
        },
        {
            id: "posts",
            header: "Posts",
            accessorFn: (row) => row._count.Posts,
            cell: ({ getValue }) => <span className="text-xs tabular-nums">{getValue<number>()}</span>,
        },
        {
            id: "projects",
            header: "Projets",
            accessorFn: (row) => row._count.projects,
            cell: ({ getValue }) => <span className="text-xs tabular-nums">{getValue<number>()}</span>,
        },
        {
            id: "resources",
            header: "Ressources",
            accessorFn: (row) => row._count.resources,
            cell: ({ getValue }) => <span className="text-xs tabular-nums">{getValue<number>()}</span>,
        },
        {
            id: "communities",
            header: "Communautés",
            accessorFn: (row) => row._count.creator,
            cell: ({ getValue }) => <span className="text-xs tabular-nums">{getValue<number>()}</span>,
        },
        {
            id: "createdAt",
            accessorKey: "createdAt",
            header: ({ column }) => <SortableHeader column={column} label="Inscription" />,
            cell: ({ getValue }) => <span className="text-xs text-muted-foreground">{dayjs(getValue<string>()).format("DD/MM/YYYY")}</span>,
        },
        {
            id: "actions",
            header: "",
            enableHiding: false,
            enableSorting: false,
            cell: ({ row }) => (
                <UserActions
                    user={row.original}
                    onRoleEdit={setRoleTarget}
                    onDelete={setDeleteTarget}
                />
            ),
        },
    ]

    return (
        <>
            <RoleDialog
                user={roleTarget}
                open={!!roleTarget}
                onClose={() => setRoleTarget(null)}
            />
            <AdminConfirmDelete
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                label={`l'utilisateur "${deleteTarget ? getDisplayName(deleteTarget) : ""}"`}
                onConfirm={() => {
                    if (deleteTarget) del(deleteTarget.id)
                    setDeleteTarget(null)
                }}
                isPending={deleting}
            />

            <div className="flex flex-col h-[calc(100vh-5rem)] rounded-xl border border-border bg-background shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                    <div className="flex items-center gap-2">
                        <Users className="size-4 text-muted-foreground" />
                        <h1 className="text-sm font-semibold">Utilisateurs</h1>
                        <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{users.length}</Badge>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 px-4 py-3 border-b border-border shrink-0">
                    {[
                        { label: "Total", value: users.length, icon: Users },
                        { label: "Admins", value: users.filter(u => u.role === "ADMIN").length, icon: Shield },
                        { label: "Vérifiés", value: users.filter(u => u.emailVerified).length, icon: CheckCircle },
                    ].map((stat) => (
                        <div key={stat.label} className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2">
                            <stat.icon className="size-3.5 text-muted-foreground shrink-0" />
                            <div>
                                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                                <p className="text-sm font-semibold tabular-nums">{isLoading ? "—" : stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex-1 overflow-hidden px-4 py-3">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Chargement...</div>
                    ) : (
                        <AdminDataTable
                            data={users}
                            columns={columns}
                            searchKey="user"
                            searchPlaceholder="Rechercher un utilisateur..."
                        />
                    )}
                </div>
            </div>
        </>
    )
}
