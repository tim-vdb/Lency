"use client";

import { Badge } from "@/front/components/ui/badge";
import { Button } from "@/front/components/ui/button";
import { Input } from "@/front/components/ui/input";
import { Skeleton } from "@/front/components/ui/skeleton";
import { useProjects } from "@/front/hooks/queries/use-projects";
import { Briefcase, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import ProjectCard from "./Projects/ProjectCard";

const FILTER_TYPES = ["Tous", "Court métrage", "Long métrage", "Série", "Clip", "Documentaire", "Autre"];

function ProjectCardSkeleton() {
    return (
        <div className="rounded-xl border border-border overflow-hidden flex flex-col">
            <Skeleton className="w-full h-40" />
            <div className="p-4 flex flex-col gap-3">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-2/3 rounded-md" />
                <div className="flex gap-1 mt-1">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-8 w-full rounded-md mt-1" />
            </div>
        </div>
    );
}

export default function MarketplacePageClient() {
    const { data: projects, isPending } = useProjects();
    const [search, setSearch] = useState("");
    const [activeType, setActiveType] = useState("Tous");

    const filtered = useMemo(() => {
        if (!projects) return [];
        return projects.filter((p) => {
            const matchesSearch =
                !search ||
                p.title.toLowerCase().includes(search.toLowerCase()) ||
                p.description.toLowerCase().includes(search.toLowerCase());
            const matchesType =
                activeType === "Tous" ||
                (p.projectType?.toLowerCase() === activeType.toLowerCase());
            return matchesSearch && matchesType && p.status === "PUBLISHED";
        });
    }, [projects, search, activeType]);

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto">
            {/* Hero */}
            <div className="relative w-full rounded-xl overflow-hidden bg-linear-to-br from-orange-50 via-pink-50 to-violet-100 px-8 py-10 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white/70 backdrop-blur-sm">
                        <Briefcase className="w-6 h-6 text-orange-500" />
                    </div>
                    <h1 className="text-3xl font-bold uppercase">Marketplace Projets</h1>
                </div>
                <p className="text-neutral-600 max-w-lg text-sm leading-relaxed">
                    Trouvez des projets créatifs qui recherchent des collaborateurs, ou publiez votre propre projet pour recruter l&apos;équipe idéale.
                </p>
                <Button
                    className="w-fit gap-2 mt-2"
                    onClick={() => toast.info("Création de projet — bientôt disponible.")}
                >
                    <Plus className="w-4 h-4" />
                    Publier un projet
                </Button>
            </div>

            {/* Filtres */}
            <div className="flex flex-col gap-3 sticky top-0 z-10 bg-transparent">
                {/* Barre de recherche */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                        placeholder="Rechercher un projet..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 bg-white dark:bg-neutral-900"
                    />
                </div>

                {/* Chips de type */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {FILTER_TYPES.map((type) => (
                        <button
                            key={type}
                            onClick={() => setActiveType(type)}
                            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${activeType === type
                                ? "bg-neutral-900 text-white border-neutral-900"
                                : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Compteur */}
            {!isPending && (
                <p className="text-sm text-neutral-500">
                    {filtered.length} projet{filtered.length !== 1 ? "s" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
                </p>
            )}

            {/* Grille */}
            {isPending ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <ProjectCardSkeleton key={i} />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <div className="p-4 rounded-full bg-neutral-100">
                        <Briefcase className="w-8 h-8 text-neutral-300" />
                    </div>
                    <div className="text-center">
                        <p className="font-semibold text-neutral-700">Aucun projet trouvé</p>
                        <p className="text-sm text-neutral-400 mt-1">
                            {search || activeType !== "Tous"
                                ? "Essayez d'autres filtres ou termes de recherche."
                                : "Soyez le premier à publier un projet !"}
                        </p>
                    </div>
                    {(search || activeType !== "Tous") && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => { setSearch(""); setActiveType("Tous"); }}
                        >
                            Réinitialiser les filtres
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}
        </div>
    );
}
