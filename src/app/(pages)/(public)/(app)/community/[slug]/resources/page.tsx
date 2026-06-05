import type { Metadata } from 'next';
import CategoryResourcesPageClient from "@/front/components/Public/Community/Resources/CategoryResourcesPageClient";
import { CategoriesService } from "@/back/services/categories.service";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const category = await CategoriesService.findBySlugCategory(slug).catch(() => null);
    if (!category) return { title: 'Ressources — Lency' };
    return {
        title: `Ressources ${category.name} — Lency`,
        description: `Parcourez les ressources partagées dans la catégorie ${category.name} sur Lency.`,
    };
}

export default async function CategoryResourcesPage({ params }: Props) {
    const { slug } = await params;
    return <CategoryResourcesPageClient slug={slug} />;
}
