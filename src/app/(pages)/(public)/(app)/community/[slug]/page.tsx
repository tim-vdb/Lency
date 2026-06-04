import type { Metadata } from 'next';
import CategoryPageClient from "@/front/components/Public/Community/Category/CategoryPageClient";
import { CategoriesService } from "@/back/services/categories.service";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const category = await CategoriesService.findBySlugCategory(slug).catch(() => null);
    if (!category) return { title: 'Catégorie introuvable — Lency' };
    return {
        title: `${category.name} — Communauté Lency`,
        description: `Explorez les posts et discussions de la catégorie ${category.name} sur Lency.`,
    };
}

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params;
    return <CategoryPageClient slug={slug} />;
}
