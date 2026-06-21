import CreateBlogForm from "../_components/CreateBlogForm"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function CreateBlogPage() {
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
                    <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">Nouvel article</h1>
                    <p className="text-neutral-500 mt-1">Rédigez et publiez un nouvel article de blog</p>
                </div>
                <CreateBlogForm />
            </section>
        </main>
    )
}
