import { BlogsAction } from "@/back/repositories/blogs.action"
import { getUser } from "@/back/lib/auth-session"
import BlogList from "./_components/BlogList"

export default async function BlogPage() {
    const [blogs, user] = await Promise.all([
        BlogsAction.findAll(),
        getUser(),
    ])

    const isAdmin = user?.role === "ADMIN"

    return (
        <main className="min-h-screen bg-white">
            <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8 md:mb-12">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                        Notre Blog
                    </h1>
                </div>
                <BlogList blogs={blogs} isAdmin={isAdmin} />
            </section>
        </main>
    )
}
