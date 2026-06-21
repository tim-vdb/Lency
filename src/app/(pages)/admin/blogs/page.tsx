import { BlogsAction } from "@/back/repositories/blogs.action"
import { getUser } from "@/back/lib/auth-session"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Pencil } from "lucide-react"
import { Badge } from "@/front/components/ui/badge"

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
    PUBLISHED: { label: "Publié", variant: "default" },
    DRAFT: { label: "Brouillon", variant: "secondary" },
    ARCHIVED: { label: "Archivé", variant: "outline" },
}

export default async function AdminBlogPage() {
    const user = await getUser()
    if (!user || user.role !== "ADMIN") redirect("/")

    const blogs = await BlogsAction.findAll()

    return (
        <main className="min-h-screen">
            <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">Articles</h1>
                    <p className="text-sm text-neutral-400 mt-1">{blogs.length} article{blogs.length > 1 ? "s" : ""}</p>
                </div>

                {blogs.length === 0 ? (
                    <p className="text-sm text-neutral-400">Aucun article pour le moment.</p>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {blogs.map((blog) => {
                            const status = STATUS_LABELS[blog.status] ?? { label: blog.status, variant: "outline" as const }
                            return (
                                <li
                                    key={blog.id}
                                    className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm text-neutral-700"
                                >
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <span className="font-medium line-clamp-1">{blog.title}</span>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge variant={status.variant} className="text-xs py-0">
                                                {status.label}
                                            </Badge>
                                            {blog.tags.map(t => (
                                                <span key={t} className="text-xs text-neutral-400">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <Link
                                        href={`/admin/blogs/${blog.id}/edit`}
                                        className="ml-3 shrink-0 flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-800 transition-colors px-2 py-1 rounded hover:bg-neutral-100"
                                    >
                                        <Pencil className="size-3" />
                                        Modifier
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </section>
        </main>
    )
}
