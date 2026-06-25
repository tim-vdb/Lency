import { BlogsAction } from "@/back/repositories/blogs.action"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { getUser } from "@/back/lib/auth-session"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${title} — Blog Lency`,
    description: `Lisez l'article "${title}" sur le blog Lency.`,
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: blogId } = await params

  try {
    const blog = await BlogsAction.findById(blogId)

    if (!blog) {
      notFound()
    }

    const user = await getUser()
    const isAdmin = user?.role === "ADMIN"

    // Vérifier si c'est un brouillon et que l'utilisateur n'est pas admin
    if (blog.status === "DRAFT" && !isAdmin) {
      notFound()
    }

    const formattedDate = format(new Date(blog.createdAt), "d MMMM yyyy", {
      locale: fr,
    })


    return (
      <main className="min-h-screen bg-white dark:bg-neutral-900">
        {/* Header avec image de couverture */}
        {blog.coverUrl && (
          <div className="relative h-96 w-full overflow-hidden bg-gray-900 dark:bg-neutral-800">
            <img
              src={blog.coverUrl}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        )}

        <article className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          {/* Retour et meta */}
          <div className="mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6"
            >
              <ArrowLeft className="size-4" />
              Retour aux articles
            </Link>

            {/* Titre et meta */}
            <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-4 font-chunko">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-neutral-600 dark:text-neutral-300">
              {blog.tags.map(tag => (
                <span key={tag} className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                  {tag}
                </span>
              ))}
              <span className="text-sm">{formattedDate}</span>
              {blog.status === "DRAFT" && (
                <span className="inline-block px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium">
                  Brouillon
                </span>
              )}
            </div>
          </div>

          {/* Contenu */}
          <div className="prose dark:prose-invert prose-lg max-w-none">
            {blog.content.split("\n").map((paragraph: string, index: number) => (
              <p key={index} className="text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-neutral-700">
            <Link
              href="/blog"
              className="inline-block px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Lire d'autres articles
            </Link>
          </div>
        </article>
      </main>
    )
  } catch (error) {
    console.error("Erreur lors du chargement du blog:", error)
    notFound()
  }
}
