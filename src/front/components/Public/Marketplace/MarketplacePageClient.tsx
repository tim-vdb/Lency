"use client";

import { CreateProjectForm } from "@/front/components/Private/Global/CreateProjectForm";
import { Button } from "@/front/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogTitle } from "@/front/components/ui/dialog";
import { Input } from "@/front/components/ui/input";
import { Skeleton } from "@/front/components/ui/skeleton";
import { useProjects } from "@/front/hooks/queries/use-projects";
import { ProjectWithOwner } from "@/front/types/project.schema";
import { Briefcase, ChevronRight, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProjectCard from "./Projects/ProjectCard";

const PROJECT_TYPES = ["Court métrage", "Long métrage", "Série", "Clip", "Documentaire", "Autre"];

function ProjectCardSkeleton() {
    return (
        <div className="rounded-xl border border-border overflow-hidden flex flex-col">
            <Skeleton className="w-full h-44" />
            <div className="p-4 flex flex-col gap-3">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-2/3 rounded-md" />
                <div className="flex gap-1 mt-1">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                </div>
            </div>
        </div>
    );
}

function TypeSection({ type, projects }: { type: string; projects: ProjectWithOwner[] }) {
    const encodedType = encodeURIComponent(type);
    const navPrev = `prev-${type.replace(/\s/g, "-")}`;
    const navNext = `next-${type.replace(/\s/g, "-")}`;

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <Link
                    href={`/marketplace/categories/${encodedType}`}
                    className="group flex items-center gap-1 font-bold text-lg hover:text-orange-500 transition-colors"
                >
                    {type}
                    <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-orange-500 transition-colors" />
                </Link>

                <div className="flex gap-1.5">
                    <button
                        className={`${navPrev} p-1.5 rounded-full border border-neutral-200 hover:bg-neutral-100 transition-colors disabled:opacity-30 disabled:cursor-default`}
                    >
                        <ChevronRight className="w-4 h-4 text-neutral-600 rotate-180" />
                    </button>
                    <button
                        className={`${navNext} p-1.5 rounded-full border border-neutral-200 hover:bg-neutral-100 transition-colors disabled:opacity-30 disabled:cursor-default`}
                    >
                        <ChevronRight className="w-4 h-4 text-neutral-600" />
                    </button>
                </div>
            </div>

            <Swiper
                modules={[Navigation]}
                navigation={{ prevEl: `.${navPrev}`, nextEl: `.${navNext}` }}
                spaceBetween={16}
                slidesPerView={1.2}
                breakpoints={{
                    640: { slidesPerView: 2.2 },
                    1024: { slidesPerView: 3.1 },
                    1280: { slidesPerView: 3.5 },
                }}
                className="w-full"
            >
                {projects.map((project) => (
                    <SwiperSlide key={project.id} className="h-auto">
                        <ProjectCard project={project} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

function TypeSectionSkeleton({ type }: { type: string }) {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <span className="font-bold text-lg">{type}</span>
                    <ChevronRight className="w-5 h-5 text-neutral-300" />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <ProjectCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}

export default function MarketplacePageClient() {
    const { data: projects, isPending } = useProjects();
    const [search, setSearch] = useState("");

    const published = useMemo(
        () => projects?.filter((p) => p.status === "PUBLISHED") ?? [],
        [projects]
    );

    const searchFiltered = useMemo(() => {
        if (!search) return published;
        const q = search.toLowerCase();
        return published.filter(
            (p) =>
                p.title.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q)
        );
    }, [published, search]);

    const byType = useMemo(() => {
        const knownTypes = PROJECT_TYPES.map((t) => t.toLowerCase());
        const map = new Map<string, ProjectWithOwner[]>();

        for (const type of PROJECT_TYPES) {
            const items = searchFiltered.filter(
                (p) => p.projectType?.toLowerCase() === type.toLowerCase()
            );
            if (items.length > 0) map.set(type, items);
        }

        const otherItems = searchFiltered.filter(
            (p) => !p.projectType || !knownTypes.includes(p.projectType.toLowerCase())
        );
        if (otherItems.length > 0) {
            map.set("Autre", [...(map.get("Autre") ?? []), ...otherItems]);
        }

        return map;
    }, [searchFiltered]);

    const totalCount = searchFiltered.length;
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto">
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
                <Button className="w-fit gap-2 mt-2" onClick={() => setModalOpen(true)}>
                    <Plus className="w-4 h-4" />
                    Publier un projet
                </Button>
            </div>

            {/* Recherche */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                    placeholder="Rechercher un projet..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 bg-white dark:bg-neutral-900"
                />
            </div>

            {/* Compteur */}
            {!isPending && (
                <p className="text-sm text-neutral-500 -mt-4">
                    {totalCount} projet{totalCount !== 1 ? "s" : ""} trouvé{totalCount !== 1 ? "s" : ""}
                </p>
            )}

            {/* Sections par type */}
            {isPending ? (
                <div className="flex flex-col gap-10">
                    {PROJECT_TYPES.slice(0, 3).map((type) => (
                        <TypeSectionSkeleton key={type} type={type} />
                    ))}
                </div>
            ) : byType.size === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <div className="p-4 rounded-full bg-neutral-100">
                        <Briefcase className="w-8 h-8 text-neutral-300" />
                    </div>
                    <div className="text-center">
                        <p className="font-semibold text-neutral-700">Aucun projet trouvé</p>
                        <p className="text-sm text-neutral-400 mt-1">
                            {search
                                ? "Essayez d'autres termes de recherche."
                                : "Soyez le premier à publier un projet !"}
                        </p>
                    </div>
                    {search && (
                        <Button variant="outline" size="sm" onClick={() => setSearch("")}>
                            Réinitialiser la recherche
                        </Button>
                    )}
                </div>
            ) : (
                <div className="flex flex-col gap-10">
                    {Array.from(byType.entries()).map(([type, items]) => (
                        <TypeSection key={type} type={type} projects={items} />
                    ))}
                </div>
            )}

            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogPortal>
                    <DialogOverlay />
                    <DialogContent className="p-0 gap-0 w-full max-w-2xl max-h-[85vh] flex overflow-hidden rounded-xl">
                        <DialogTitle className="sr-only">Publier un projet</DialogTitle>
                        <DialogDescription className="sr-only">Formulaire de création de projet</DialogDescription>
                        <div className="flex-1 overflow-y-auto p-6">
                            <CreateProjectForm onSuccess={() => setModalOpen(false)} />
                        </div>
                    </DialogContent>
                </DialogPortal>
            </Dialog>
        </div>
    );
}
