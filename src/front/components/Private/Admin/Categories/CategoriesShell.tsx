"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Hash, Plus, Pencil } from "lucide-react"
import dayjs from "dayjs"
import { AdminDataTable, SortableHeader } from "@/front/components/Private/Admin/Shared/AdminDataTable"
import { AdminConfirmDelete } from "@/front/components/Private/Admin/Shared/AdminConfirmDelete"
import {
    useAdminCategories, useCreateAdminCategory,
    usePatchAdminCategory, useDeleteAdminCategory,
} from "@/front/queries/admin-data"
import type { AdminCategory } from "@/front/schemas/types/admin-data.type"
import { Badge } from "@/front/components/ui/badge"
import { Button } from "@/front/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/front/components/ui/avatar"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/front/components/ui/dialog"
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/front/components/ui/form"
import { Input } from "@/front/components/ui/input"
import { Textarea } from "@/front/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { getDisplayName, getInitialName } from "@/front/lib/utils"

const categoryFormSchema = z.object({
    name: z.string().min(1, "Requis"),
    slug: z.string().min(1, "Requis").regex(/^[a-z0-9-]+$/, "Lettres minuscules, chiffres et tirets uniquement"),
    description: z.string().optional(),
})
type CategoryFormValues = z.infer<typeof categoryFormSchema>

function toSlug(name: string) {
    return name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim()
}

// ─── Dialog rendu UNE SEULE FOIS au niveau du shell ──────────────────────────

function CategoryFormDialog({
    open,
    onClose,
    initial,
}: {
    open: boolean
    onClose: () => void
    initial?: AdminCategory
}) {
    const { mutate: create, isPending: creating } = useCreateAdminCategory()
    const { mutate: patch, isPending: patching } = usePatchAdminCategory()
    const isPending = creating || patching

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categoryFormSchema),
        values: {
            name: initial?.name ?? "",
            slug: initial?.slug ?? "",
            description: initial?.description ?? "",
        },
    })

    function onSubmit(values: CategoryFormValues) {
        if (initial) {
            patch({ id: initial.id, ...values }, { onSuccess: onClose })
        } else {
            create(values, {
                onSuccess: () => {
                    form.reset()
                    onClose()
                },
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{initial ? "Modifier la communauté" : "Créer une communauté"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nom</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="ex: Technologie"
                                        onChange={(e) => {
                                            field.onChange(e)
                                            if (!initial) form.setValue("slug", toSlug(e.target.value))
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="slug" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug</FormLabel>
                                <FormControl><Input {...field} placeholder="ex: technologie" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl><Textarea {...field} placeholder="Description (optionnel)" rows={3} className="resize-none" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>Annuler</Button>
                            <Button type="submit" disabled={isPending}>{isPending ? "Enregistrement..." : initial ? "Enregistrer" : "Créer"}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

// ─── Actions en ligne — uniquement des callbacks, pas de state ───────────────

interface CategoryActionsProps {
    category: AdminCategory
    onEdit: (c: AdminCategory) => void
    onDelete: (c: AdminCategory) => void
}

function CategoryActions({ category, onEdit, onDelete }: CategoryActionsProps) {
    return (
        <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="size-7" onClick={() => onEdit(category)}>
                <Pencil className="size-3.5" />
            </Button>
            <Button
                variant="ghost" size="icon" className="size-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(category)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" /></svg>
            </Button>
        </div>
    )
}

export function CategoriesShell() {
    const { data: categories = [], isLoading } = useAdminCategories()
    const { mutate: del, isPending: deleting } = useDeleteAdminCategory()

    const [createOpen, setCreateOpen] = useState(false)
    const [editTarget, setEditTarget] = useState<AdminCategory | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null)

    const totalPosts = categories.reduce((acc, c) => acc + (c._count?.posts ?? 0), 0)
    const totalResources = categories.reduce((acc, c) => acc + (c._count?.ressources ?? 0), 0)
    const totalMembers = categories.reduce((acc, c) => acc + (c._count?.followers ?? 0), 0)

    const columns: ColumnDef<AdminCategory>[] = [
        {
            id: "name",
            accessorKey: "name",
            header: ({ column }) => <SortableHeader column={column} label="Nom" />,
            cell: ({ row }) => {
                const c = row.original
                return (
                    <Link href={`/community/${c.slug}`} target="_blank" className="flex items-center gap-2 group">
                        {c.iconUrl
                            ? <img src={c.iconUrl} alt="" className="size-5 rounded-full object-cover" />
                            : <div className="size-5 rounded-full bg-muted flex items-center justify-center"><Hash className="size-3 text-muted-foreground" /></div>
                        }
                        <div>
                            <p className="text-xs font-medium group-hover:underline">{c.name}</p>
                            <p className="text-[10px] text-muted-foreground">/{c.slug}</p>
                        </div>
                    </Link>
                )
            },
        },
        {
            id: "description",
            accessorKey: "description",
            header: "Description",
            cell: ({ getValue }) => <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{getValue<string>() ?? "—"}</span>,
        },
        {
            id: "posts",
            header: ({ column }) => <SortableHeader column={column} label="Posts" />,
            accessorFn: (row) => row._count?.posts ?? 0,
            cell: ({ getValue }) => <span className="text-xs tabular-nums">{getValue<number>()}</span>,
        },
        {
            id: "ressources",
            header: ({ column }) => <SortableHeader column={column} label="Ressources" />,
            accessorFn: (row) => row._count?.ressources ?? 0,
            cell: ({ getValue }) => <span className="text-xs tabular-nums">{getValue<number>()}</span>,
        },
        {
            id: "members",
            header: ({ column }) => <SortableHeader column={column} label="Membres" />,
            accessorFn: (row) => row._count?.followers ?? 0,
            cell: ({ getValue }) => <span className="text-xs tabular-nums">{getValue<number>()}</span>,
        },
        {
            id: "creator",
            header: "Créateur",
            cell: ({ row }) => {
                const creator = row.original.creator
                return (
                    <Link href={`/user/${creator.username}`} target="_blank" className="flex items-center gap-1.5 group">
                        <Avatar className="size-5">
                            <AvatarImage src={creator.image ?? creator.avatarUrl ?? ""} />
                            <AvatarFallback className="text-[9px]">{getInitialName(creator)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs group-hover:underline">{getDisplayName(creator)}</span>
                    </Link>
                )
            },
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
                <CategoryActions
                    category={row.original}
                    onEdit={setEditTarget}
                    onDelete={setDeleteTarget}
                />
            ),
        },
    ]

    return (
        <>
            {/* Dialogs hors du tableau */}
            <CategoryFormDialog
                open={createOpen}
                onClose={() => setCreateOpen(false)}
            />
            <CategoryFormDialog
                open={!!editTarget}
                onClose={() => setEditTarget(null)}
                initial={editTarget ?? undefined}
            />
            <AdminConfirmDelete
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                label={`la communauté "${deleteTarget?.name ?? ""}"`}
                onConfirm={() => { if (deleteTarget) del(deleteTarget.id) }}
                isPending={deleting}
            />

            <div className="flex flex-col h-[calc(100vh-5rem)] rounded-xl border border-border bg-background shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                    <div className="flex items-center gap-2">
                        <Hash className="size-4 text-muted-foreground" />
                        <h1 className="text-sm font-semibold">Communautés</h1>
                        <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{categories.length}</Badge>
                    </div>
                    <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={() => setCreateOpen(true)}>
                        <Plus className="size-3.5" /> Créer
                    </Button>
                </div>

                <div className="grid grid-cols-4 gap-3 px-4 py-3 border-b border-border shrink-0">
                    {[
                        { label: "Communautés", value: categories.length },
                        { label: "Posts totaux", value: totalPosts },
                        { label: "Ressources totales", value: totalResources },
                        { label: "Membres totaux", value: totalMembers },
                    ].map((s) => (
                        <div key={s.label} className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2">
                            <Hash className="size-3.5 text-muted-foreground shrink-0" />
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
                            data={categories}
                            columns={columns}
                            searchKey="name"
                            searchPlaceholder="Rechercher une communauté..."
                        />
                    )}
                </div>
            </div>
        </>
    )
}
