export const SEARCH_ROOT = ["search"] as const;

import { Category } from "./categories";
import { PostWithAuthorAndCategory } from "@/front/schemas/types/post.type";
import { ProjectWithOwner } from "@/front/schemas/types/project.type";
import { ResourceWithAuthorAndCategory } from "@/front/schemas/types/resource.type";

// L'excerpt est généré par ts_headline côté PostgreSQL :
// extrait contextuel de 8-20 mots avec les termes recherchés entre «»
export interface SearchResults {
    projects:   (ProjectWithOwner & { excerpt: string })[];
    categories: (Category & { excerpt: string })[];
    posts:      (PostWithAuthorAndCategory & { excerpt: string })[];
    resources:  (ResourceWithAuthorAndCategory & { excerpt: string })[];
}

export async function fetchSearchResults(query: string): Promise<SearchResults> {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Erreur lors de la recherche");
    return res.json();
}
