"use client";

import { useProjects } from "@/front/queries/projects";
import { useMarketplaceStore } from "@/front/states/stores/marketplace.store";
import { ProjectWithOwner } from "@/front/schemas/types/project.type";
import { Briefcase } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useMemo } from "react";
import { SwiperSlide } from "swiper/react";
import { CarouselSection } from "../CarouselSection";
import { EmptyState } from "../EmptyState";
import { FilterSelect } from "../Filtrage/FilterSelect";
import { FiltersPanel } from "../Filtrage/FiltersPanel";
import { DATE_OPTIONS, LEVEL_OPTIONS, LEVEL_VALUES, PROJECT_TYPES, REMUNERATION_OPTIONS, REMUNERATION_VALUES, WORKMODE_OPTIONS, WORKMODE_VALUES } from "../marketplace.constants";
import { projectFilterParsers } from "../marketplace.params";
import { OnboardingProjectCard } from "../OnboardingCards";
import { ProjectSkeleton } from "../Skeletons";
import ProjectCard from "./ProjectCard";

function matchesDate(createdAt: Date | string, pDate: string): boolean {
    const now = new Date();
    const created = new Date(createdAt);
    if (pDate === "Aujourd'hui") {
        return created.toDateString() === now.toDateString();
    }
    if (pDate === "Cette semaine") {
        const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        return created >= weekAgo;
    }
    if (pDate === "Ce mois") {
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }
    if (pDate === "Cette année") {
        return created.getFullYear() === now.getFullYear();
    }
    return true;
}

export function ProjectsTab({ isNewUser, onOpenProjectModal }: {
    isNewUser: boolean;
    onOpenProjectModal: () => void;
}) {
    const { data: projects, isPending } = useProjects();
    const { filtersOpen } = useMarketplaceStore();

    const [{ pType, pWorkMode, pLevel, pRemu, pCity, pDate }, setFilters] = useQueryStates(projectFilterParsers, { shallow: true, scroll: false });

    const hasActiveFilters = !!(pType || pWorkMode || pLevel || pRemu || pCity || pDate);

    function resetFilters() {
        setFilters({ pType: "", pWorkMode: "", pLevel: "", pRemu: "", pCity: "", pDate: "" });
    }

    const published = useMemo(() =>
        projects?.filter((p) => p.status === "PUBLISHED") ?? [],
        [projects]
    );

    // Villes disponibles extraites dynamiquement des projets publiés
    const availableCities = useMemo(() => {
        const set = new Set<string>();
        published.forEach((p) => { if (p.mapLocation?.name) set.add(p.mapLocation.name); });
        return Array.from(set).sort();
    }, [published]);

    const filtered = useMemo(() => published.filter((p) => {
        if (pType && p.projectType?.toLowerCase() !== pType.toLowerCase()) return false;
        if (pWorkMode && p.workMode !== WORKMODE_VALUES[pWorkMode]) return false;
        if (pLevel && p.level !== LEVEL_VALUES[pLevel]) return false;
        if (pRemu && p.remunerationType !== REMUNERATION_VALUES[pRemu]) return false;
        if (pCity && p.mapLocation?.name?.toLowerCase() !== pCity.toLowerCase()) return false;
        if (pDate && !matchesDate(p.createdAt, pDate)) return false;
        return true;
    }), [published, pType, pWorkMode, pLevel, pRemu, pCity, pDate]);

    const byType = useMemo(() => {
        const knownTypes = PROJECT_TYPES.map((t) => t.toLowerCase());
        const map = new Map<string, ProjectWithOwner[]>();
        for (const type of PROJECT_TYPES) {
            const items = filtered.filter((p) => p.projectType?.toLowerCase() === type.toLowerCase());
            if (items.length > 0) map.set(type, items);
        }
        const others = filtered.filter((p) => !p.projectType || !knownTypes.includes(p.projectType.toLowerCase()));
        if (others.length > 0) map.set("Autre", [...(map.get("Autre") ?? []), ...others]);
        return map;
    }, [filtered]);

    return (
        <div className="flex flex-col gap-6">
            <FiltersPanel open={filtersOpen} hasActiveFilters={hasActiveFilters} onReset={resetFilters}>
                <FilterSelect label="Type de projets" options={PROJECT_TYPES} value={pType} onChange={(v) => setFilters({ pType: v })} />
                <FilterSelect label="Ville" options={availableCities} value={pCity} onChange={(v) => setFilters({ pCity: v })} />
                <FilterSelect label="Mode de travail" options={WORKMODE_OPTIONS} value={pWorkMode} onChange={(v) => setFilters({ pWorkMode: v })} />
                <FilterSelect label="Niveau" options={LEVEL_OPTIONS} value={pLevel} onChange={(v) => setFilters({ pLevel: v })} />
                <FilterSelect label="Rémunération" options={REMUNERATION_OPTIONS} value={pRemu} onChange={(v) => setFilters({ pRemu: v })} />
                <FilterSelect label="Publié depuis" options={DATE_OPTIONS} value={pDate} onChange={(v) => setFilters({ pDate: v })} />
            </FiltersPanel>

            {isPending ? (
                <div className="flex flex-col gap-10">
                    {PROJECT_TYPES.slice(0, 3).map((type) => <ProjectSkeleton key={type} label={type} />)}
                </div>
            ) : byType.size === 0 ? (
                <div className="flex flex-col gap-4">
                    {isNewUser && <OnboardingProjectCard onAction={onOpenProjectModal} />}
                    <EmptyState
                        icon={<Briefcase className="w-8 h-8 text-neutral-300" />}
                        title="Aucun projet trouvé"
                        subtitle={hasActiveFilters ? "Essayez d'autres filtres." : "Soyez le premier à publier un projet !"}
                        hasFilters={hasActiveFilters}
                        onReset={resetFilters}
                    />
                </div>
            ) : (
                <div className="flex flex-col gap-8">
                    {isNewUser && <OnboardingProjectCard onAction={onOpenProjectModal} />}
                    {Array.from(byType.entries()).map(([type, items]) => (
                        <CarouselSection key={type} label={type} href={`/marketplace/categories/${encodeURIComponent(type)}`} count={items.length}>
                            {items.map((project) => (
                                <SwiperSlide key={project.id} className="h-auto">
                                    <ProjectCard project={project} />
                                </SwiperSlide>
                            ))}
                        </CarouselSection>
                    ))}
                </div>
            )}
        </div>
    );
}
