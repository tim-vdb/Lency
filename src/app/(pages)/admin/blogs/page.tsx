import { BlogsAction } from "@/back/repositories/blogs.action"
import { getUser } from "@/back/lib/auth-session"
import { redirect } from "next/navigation"
import CreateBlogForm from "./_components/CreateBlogForm"

export default async function AdminBlogPage() {
    const user = await getUser()
    if (!user || user.role !== "ADMIN") redirect("/")

    const blogs = await BlogsAction.findAll()

    return (
        <main className="min-h-screen bg-white">
            <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8 md:mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                        Gestion du Blog
                    </h1>
                    <span className="text-sm text-gray-400">{blogs.length} article{blogs.length > 1 ? "s" : ""}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Formulaire création */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-5">Nouvel article</h2>
                        <CreateBlogForm />
                    </div>

                    {/* Liste des articles existants */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xl font-semibold text-gray-800">Articles publiés</h2>
                        {blogs.length === 0 ? (
                            <p className="text-sm text-gray-400">Aucun article pour le moment.</p>
                        ) : (
                            <ul className="flex flex-col gap-3">
                                {blogs.map((blog) => (
                                    <li
                                        key={blog.id}
                                        className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700"
                                    >
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-medium line-clamp-1">{blog.title}</span>
                                            <span className="text-xs text-gray-400">{blog.tag} · {blog.status}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </section>
        </main>
    )
}
