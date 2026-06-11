"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal, ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/front/components/ui/button";
import { Card, CardContent } from "@/front/components/ui/card";
import { useProjects } from "@/front/queries/projects";
import { useTalents } from "@/front/queries/talents";
import { ProjectsMap } from "./map/ProjectsMap";
import { TalentsMap } from "./map/TalentsMap";
import MapFilters, { type MapFiltersValues } from "./Explore/MapFilters";
import TalentFilters, { type TalentFiltersValues } from "./Explore/TalentFilters";
import { DashboardProjectCard } from "./DashboardProjectCard";
import { DashboardTalentCard } from "./DashboardTalentCard";
import { getTalentRoles, getTalentPreferences } from "@/front/lib/api/talents";
import type { ProjectWithOwner } from "@/front/schemas/types/project.type";
import type { Talent } from "@/front/lib/api/talents";

interface DashboardExplorerProps {
    mode: "projets" | "talents";
    expanded: boolean;
    onExpand: () => void;
    onCollapse: () => void;
}

const INITIAL_PROJECT_FILTERS: MapFiltersValues = {
    title: "",
    projectType: "Tout",
    level: "Tout",
    remuneration: "Tout",
    workMode: "Tout",
    dateFrom: "",
    dateTo: "",
};

const INITIAL_TALENT_FILTERS: TalentFiltersValues = {
    workMode: "Tout",
    level: "Tout",
    remuneration: "Tout",
    roles: "",
};

export function DashboardExplorer({ mode, expanded, onCollapse }: DashboardExplorerProps) {
    const { data: projects = [] } = useProjects();
    const { data: talents = [] } = useTalents();

    const [filtersOpen, setFiltersOpen] = useState(false);
    const [projectFilters, setProjectFilters] = useState<MapFiltersValues>(INITIAL_PROJECT_FILTERS);
    const [talentFilters, setTalentFilters] = useState<TalentFiltersValues>(INITIAL_TALENT_FILTERS);

    const handleProjectFilterChange = <K extends keyof MapFiltersValues>(key: K, value: MapFiltersValues[K]) => {
        setProjectFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleTalentFilterChange = <K extends keyof TalentFiltersValues>(key: K, value: TalentFiltersValues[K]) => {
        setTalentFilters((prev) => ({ ...prev, [key]: value }));
    };

    /* ── Projets filtrés ── */
    const titleSuggestions = useMemo(() => {
        if (!projectFilters.title) return [];
        return projects
            .filter((p) => p.title.toLowerCase().includes(projectFilters.title.toLowerCase()))
            .slice(0, 5)
            .map((p) => ({ id: p.id, title: p.title }));
    }, [projectFilters.title, projects]);

    const filteredProjects: ProjectWithOwner[] = useMemo(() => {
        const f = projectFilters;
        return projects.filter((p) => {
            if (f.title && !p.title.toLowerCase().includes(f.title.toLowerCase())) return false;
            if (f.projectType !== "Tout" && p.projectType !== f.projectType) return false;
            if (f.level !== "Tout" && p.level !== f.level) return false;
            if (f.remuneration !== "Tout" && p.remunerationType !== f.remuneration) return false;
            if (f.workMode !== "Tout" && p.workMode !== f.workMode) return false;
            if (f.dateFrom && p.startDate && new Date(p.startDate) < new Date(f.dateFrom)) return false;
            if (f.dateTo && p.startDate && new Date(p.startDate) > new Date(f.dateTo)) return false;
            return true;
        });
    }, [projects, projectFilters]);

    /* ── Talents filtrés ── */
    const filteredTalents: Talent[] = useMemo(() => {
        const f = talentFilters;
        return talents.filter((t) => {
            const prefs = getTalentPreferences(t);
            const roles = getTalentRoles(t);
            if (f.workMode !== "Tout" && prefs.workMode !== f.workMode) return false;
            if (f.level !== "Tout" && prefs.level !== f.level) return false;
            if (f.remuneration !== "Tout" && prefs.remunerationType !== f.remuneration) return false;
            if (f.roles.trim()) {
                const search = f.roles.toLowerCase();
                if (!roles.some((r) => r.toLowerCase().includes(search))) return false;
            }
            return true;
        });
    }, [talents, talentFilters]);

    /* ── Fullscreen overlay ── */
    if (expanded) {
        return (
            <div className="fixed inset-0 z-50 bg-black flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-neutral-700 shrink-0">
                    <h2 className="text-lg font-semibold text-white">Explorer</h2>
                    <Button variant="ghost" size="icon" onClick={onCollapse} className="text-white hover:bg-neutral-800">
                        <X className="w-5 h-5" />
                    </Button>
                </div>
                <div className="flex-1 overflow-hidden">
                    {mode === "projets"
                        ? <ProjectsMap projects={filteredProjects} />
                        : <TalentsMap talents={filteredTalents} />}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto">
            {/* Filtres */}
            <div className="shrink-0">
                <button
                    onClick={() => setFiltersOpen((v) => !v)}
                    className="flex items-center gap-2 text-sm font-medium text-[#4C4A43] hover:text-black transition-colors cursor-pointer"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filtres
                    {filtersOpen
                        ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
                        : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
                </button>

                {filtersOpen && (
                    <div className="mt-3 p-4 bg-[#F7F7F2] rounded-xl border border-[#E8E8E1]">
                        {mode === "projets"
                            ? <MapFilters titleSuggestions={titleSuggestions} values={projectFilters} onChange={handleProjectFilterChange} />
                            : <TalentFilters values={talentFilters} onChange={handleTalentFilterChange} />}
                    </div>
                )}
            </div>

            {/* Map */}
            <Card className="border border-[#E8E8E1] overflow-hidden py-0 shrink-0 w-full rounded-xl" style={{ height: "clamp(220px, 30.6vh, 330px)" }}>
                <CardContent className="p-0 h-full">
                    {mode === "projets"
                        ? <ProjectsMap projects={filteredProjects} />
                        : <TalentsMap talents={filteredTalents} />}
                </CardContent>
            </Card>

            {/* Liste sous la map */}
            <div className="shrink-0">
                {mode === "projets" ? (
                    filteredProjects.length === 0 ? (
                        <p className="text-sm text-[#8C8A85] text-center py-6">Aucun projet trouvé</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 pb-2">
                            {filteredProjects.map((p) => (
                                <DashboardProjectCard
                                    key={p.id}
                                    project={p}
                                    style={{ height: "clamp(100px, 14.2vh, 153px)" }}
                                />
                            ))}
                        </div>
                    )
                ) : (
                    filteredTalents.length === 0 ? (
                        <p className="text-sm text-[#8C8A85] text-center py-6">Aucun talent trouvé</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 pb-2">
                            {filteredTalents.map((t) => (
                                <DashboardTalentCard
                                    key={t.id}
                                    talent={t}
                                    style={{ height: "clamp(100px, 14.2vh, 153px)" }}
                                />
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
