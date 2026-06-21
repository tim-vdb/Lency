import { BlogsAction } from "@/back/repositories/blogs.action"
import { Prisma } from "@/back/generated/prisma_client"
import { getUser } from "@/back/lib/auth-session"
import BlogList from "./_components/BlogList"
import type { Metadata } from 'next';

type BlogWithAuthor = Prisma.BlogGetPayload<{
    include: { author: { select: { id: true; name: true; image: true } } }
}>;


export const metadata: Metadata = {
    title: 'Blog — Lency',
    description: 'Actualités, conseils et inspirations pour les créatifs audiovisuels sur le blog Lency.',
};


export default async function BlogPage() {
    const [blogs, user] = await Promise.all([
        BlogsAction.findAll(),
        getUser(),
    ])

    const isAdmin = user?.role === "ADMIN"

    // Filtrer les blogs : admins voient tout, sinon seulement les PUBLISHED
    const filteredBlogs = isAdmin ? blogs : blogs.filter((b: BlogWithAuthor) => b.status === "PUBLISHED")

    return (
        <main className="min-h-screen bg-white dark:bg-neutral-900">
            <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8 md:mb-12">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white">
                        Notre Blog
                    </h1>
                </div>
                <BlogList blogs={filteredBlogs} isAdmin={isAdmin} />
            </section>
        </main>
    )
}
