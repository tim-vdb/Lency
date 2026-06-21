import { BlogsAction } from "@/back/repositories/blogs.action"
import { getUser } from "@/back/lib/auth-session"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import EditBlogForm from "../../_components/EditBlogForm"

export default async function EditBlogPage({
    params,
}: {
    params: { blogId: string }
}) {
    const { blogId } = await params

    // Vérifier l'authentification
    const user = await getUser()
    if (!user || user.role !== "ADMIN") {
        redirect("/")
    }

    // Récupérer le blog
    const blog = await BlogsAction.findById(blogId)
    if (!blog) {
        notFound()
    }

    return (
        <main className="min-h-screen">
            <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/admin/blogs"
                        className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-800 mb-6 transition-colors"
                    >
                        <ChevronLeft className="size-4" />
                        Retour aux articles
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">Modifier l'article</h1>
                    <p className="text-neutral-500 mt-1">Mettez à jour les informations de l'article</p>
                </div>
                <EditBlogForm blog={blog} />
            </section>
        </main>
    )
}
