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
    const filteredBlogs = isAdmin ? blogs : blogs.filter((b: BlogWithAuthor) => b.status === "PUBLISHED")

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900">
            {/* Hero */}
            <section className="w-full pt-24 sm:pt-28 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col gap-4 max-w-xl">
                    <h1 className="text-[48px] font-black text-[#EA3D0E] uppercase leading-none font-chunko text-left">
                        Bienvenue sur notre blog
                    </h1>
                    <p className="text-[16px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        Plonge dans les coulisses de la création audiovisuelle. Découvre des retours d&apos;expérience sans filtre, des astuces concrètes pour optimiser tes tournages, et les décryptages des meilleurs projets de la communauté pour t&apos;inspirer au quotidien.
                    </p>
                </div>
                <hr className="mt-10 border-neutral-200 dark:border-neutral-700" />
            </section>

            {/* Blog list */}
            <section className="w-full pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <BlogList blogs={filteredBlogs} isAdmin={isAdmin} />
            </section>
        </div>
    )
}
