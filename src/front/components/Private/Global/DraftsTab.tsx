"use client"

import { useMyDraftPosts, useDeletePost, useUpdatePost } from "@/front/hooks/queries/use-posts"
import { useMyDraftProjects, useDeleteProject, useUpdateProject } from "@/front/hooks/queries/use-projects"
import { cn } from "@/front/lib/utils"
import { FileText, FolderKanban, Loader2, Globe, Trash2, Pencil, NotebookText } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/front/components/ui/button"
import { Badge } from "@/front/components/ui/badge"
import { PostWithUserState } from "@/front/types/post.schema"
import { ProjectWithOwner } from "@/front/types/project.schema"

const FORMAT_LABELS: Record<string, string> = {
    TEXT: "Texte", IMAGE: "Image", VIDEO: "Vidéo", AUDIO: "Audio",
}

export type EditDraft =
    | { type: "post"; data: PostWithUserState }
    | { type: "project"; data: ProjectWithOwner }

// ─── Draft Post Card ────────────────────────────────────────────────────────────

function DraftPostCard({ post, onEdit }: { post: PostWithUserState; onEdit: (d: EditDraft) => void }) {
    const { mutate: update, isPending: publishing } = useUpdatePost()
    const { mutate: remove, isPending: deleting } = useDeletePost()

    function publish() {
        update(
            { id: post.id, data: { isPublished: true } },
            {
                onSuccess: () => toast.success("Post publié !"),
                onError: (err) => toast.error(err.message),
            }
        )
    }

    function destroy() {
        remove(post.id, {
            onSuccess: () => toast.success("Brouillon supprimé."),
            onError: (err) => toast.error(err.message),
        })
    }

    return (
        <div className={cn(
            "group flex gap-3 p-3 rounded-lg border border-border/60 bg-card/50",
            "hover:border-border transition-colors"
        )}>
            <div className="w-8 h-8 rounded-md bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-4 h-4 text-sky-500" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate leading-snug">
                            {post.content.slice(0, 80)}{post.content.length > 80 ? "…" : ""}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal h-4">
                                {FORMAT_LABELS[post.format] ?? post.format}
                            </Badge>
                            {post.category && (
                                <span className="text-[11px] text-muted-foreground truncate">
                                    {post.category.name}
                                </span>
                            )}
                            <span className="text-[11px] text-muted-foreground">·</span>
                            <span className="text-[11px] text-muted-foreground">
                                {new Date(post.updatedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                            onClick={destroy}
                            disabled={deleting || publishing}
                            title="Supprimer"
                        >
                            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2.5 gap-1.5 text-xs"
                            onClick={() => onEdit({ type: "post", data: post })}
                            disabled={publishing || deleting}
                        >
                            <Pencil className="w-3 h-3" />
                            Éditer
                        </Button>
                        <Button
                            size="sm"
                            className="h-7 px-2.5 gap-1.5 text-xs"
                            onClick={publish}
                            disabled={publishing || deleting}
                        >
                            {publishing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Globe className="w-3 h-3" />}
                            Publier
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── Draft Project Card ─────────────────────────────────────────────────────────

function DraftProjectCard({ project, onEdit }: { project: ProjectWithOwner; onEdit: (d: EditDraft) => void }) {
    const { mutate: update, isPending: publishing } = useUpdateProject(project.id)
    const { mutate: remove, isPending: deleting } = useDeleteProject()

    function publish() {
        update(
            { status: "PUBLISHED" },
            {
                onSuccess: () => toast.success("Projet publié !"),
                onError: (err) => toast.error(err.message),
            }
        )
    }

    function destroy() {
        remove(project.id, {
            onSuccess: () => toast.success("Brouillon supprimé."),
            onError: (err) => toast.error(err.message),
        })
    }

    return (
        <div className={cn(
            "group flex gap-3 p-3 rounded-lg border border-border/60 bg-card/50",
            "hover:border-border transition-colors"
        )}>
            <div className="w-8 h-8 rounded-md bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <FolderKanban className="w-4 h-4 text-violet-500" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate leading-snug">
                            {project.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                            {project.projectType && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal h-4">
                                    {project.projectType}
                                </Badge>
                            )}
                            <span className="text-[11px] text-muted-foreground">·</span>
                            <span className="text-[11px] text-muted-foreground">
                                {new Date(project.updatedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                            onClick={destroy}
                            disabled={deleting || publishing}
                            title="Supprimer"
                        >
                            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2.5 gap-1.5 text-xs"
                            onClick={() => onEdit({ type: "project", data: project })}
                            disabled={publishing || deleting}
                        >
                            <Pencil className="w-3 h-3" />
                            Éditer
                        </Button>
                        <Button
                            size="sm"
                            className="h-7 px-2.5 gap-1.5 text-xs"
                            onClick={publish}
                            disabled={publishing || deleting}
                        >
                            {publishing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Globe className="w-3 h-3" />}
                            Publier
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── DraftsTab ─────────────────────────────────────────────────────────────────

export function DraftsTab({ onEdit }: { onEdit: (d: EditDraft) => void }) {
    const { data: draftPosts = [], isLoading: loadingPosts } = useMyDraftPosts()
    const { data: draftProjects = [], isLoading: loadingProjects } = useMyDraftProjects()

    const isLoading = loadingPosts || loadingProjects
    const total = draftPosts.length + draftProjects.length

    if (isLoading) {
        return (
            <div className="flex flex-1 items-center justify-center text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
            </div>
        )
    }

    if (total === 0) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center px-8">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <NotebookText className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                    <p className="text-sm font-medium text-foreground">Aucun brouillon</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Vos posts et projets non publiés apparaîtront ici.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col flex-1 overflow-y-auto p-5 gap-5">
            {draftPosts.length > 0 && (
                <section className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Posts
                        </span>
                        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                            {draftPosts.length}
                        </span>
                    </div>
                    <div className="flex flex-col gap-2">
                        {draftPosts.map((post) => (
                            <DraftPostCard key={post.id} post={post} onEdit={onEdit} />
                        ))}
                    </div>
                </section>
            )}

            {draftProjects.length > 0 && (
                <section className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <FolderKanban className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Projets
                        </span>
                        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                            {draftProjects.length}
                        </span>
                    </div>
                    <div className="flex flex-col gap-2">
                        {draftProjects.map((project) => (
                            <DraftProjectCard key={project.id} project={project} onEdit={onEdit} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}

export function DraftCount() {
    const { data: posts = [] } = useMyDraftPosts()
    const { data: projects = [] } = useMyDraftProjects()
    const total = posts.length + projects.length
    if (total === 0) return null
    return (
        <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground px-1">
            {total > 9 ? "9+" : total}
        </span>
    )
}

