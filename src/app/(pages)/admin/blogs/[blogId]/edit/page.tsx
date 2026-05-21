import { BlogsAction } from "@/back/repositories/blogs.action"
import { getUser } from "@/back/lib/auth-session"
import { notFound, redirect } from "next/navigation"
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
        <main className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
            <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                        Modifier l'article
                    </h1>
                    <p className="text-gray-500">Mettez à jour les informations de l'article</p>
                </div>
                <EditBlogForm blog={blog} />
            </section>
        </main>
    )
}
