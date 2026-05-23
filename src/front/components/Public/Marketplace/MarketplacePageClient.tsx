"use client";

import { CreateProjectForm } from "@/front/components/Private/Global/CreateProjectForm";
import { Dialog, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogTitle } from "@/front/components/ui/dialog";
import { Skeleton } from "@/front/components/ui/skeleton";
import { useProjects } from "@/front/hooks/queries/use-projects";
import { useTalents } from "@/front/hooks/queries/use-talents";
import { Talent } from "@/front/lib/api/talents";
import { ProjectWithOwner } from "@/front/types/project.schema";
import { Briefcase, ChevronLeft, ChevronRight, Filter, Users } from "lucide-react";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import ProjectCard from "./Projects/ProjectCard";
import TalentCard from "./Talents/TalentCard";
import { cn } from "@/front/lib/utils";

// ─── Constantes ───────────────────────────────────────────────────────────────

const PROJECT_TYPES = ["Court métrage", "Long métrage", "Série", "Clip", "Documentaire", "Autre"];
const WORKMODE_OPTIONS = ["Présentiel", "Distanciel", "Hybride"];
const REMUNERATION_OPTIONS = ["Rémunéré", "Non rémunéré"];
const LEVEL_OPTIONS = ["Débutant", "Intermédiaire", "Avancé"];

const WORKMODE_VALUES: Record<string, string> = {
    "Présentiel": "PRESENTIEL",
    "Distanciel": "DISTANCIEL",
    "Hybride": "HYBRIDE",
};
const REMUNERATION_VALUES: Record<string, string> = {
    "Rémunéré": "REMUNERE",
    "Non rémunéré": "NON_REMUNERE",
};
const LEVEL_VALUES: Record<string, string> = {
    "Débutant": "DEBUTANT",
    "Intermédiaire": "INTERMEDIAIRE",
    "Avancé": "AVANCE",
};

// ─── Composants partagés ──────────────────────────────────────────────────────

function FilterSelect({
    label,
    options,
    value,
    onChange,
}: {
    label: string;
    options: string[];
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div className="flex flex-col gap-2">
            <span className="font-['Poppins',sans-serif] font-medium text-[14px] text-black">{label}</span>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-10 px-3 pr-8 border border-gray-light rounded-[5px] bg-white font-['Poppins',sans-serif] text-[14px] text-gray appearance-none outline-none cursor-pointer"
                >
                    <option value="">{label}</option>
                    {options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                        <path d="M1 1L5 5L9 1" stroke="#8C8A85" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

function CarouselSection({
    label,
    href,
    children,
    count,
}: {
    label: string;
    href?: string;
    children: React.ReactNode;
    count: number;
}) {
    const swiperRef = useRef<SwiperType | null>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(count <= 3);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                {href ? (
                    <Link
                        href={href}
                        className="group flex items-center gap-1 font-['Poppins',sans-serif] font-bold text-[20px] leading-7 text-black hover:text-orange transition-colors"
                    >
                        {label}
                        <ChevronRight className="w-5 h-5 text-black group-hover:text-orange transition-colors" />
                    </Link>
                ) : (
                    <div className="flex items-center gap-1">
                        <span className="font-['Poppins',sans-serif] font-bold text-[20px] leading-7 text-black">{label}</span>
                        <ChevronRight className="w-5 h-5 text-black" />
                    </div>
                )}
                <div className="flex gap-2">
                    <button
                        onClick={() => swiperRef.current?.slidePrev()}
                        disabled={isBeginning}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-light bg-white hover:bg-neutral-50 transition-colors disabled:opacity-30 disabled:cursor-default"
                    >
                        <ChevronLeft className="w-4 h-4 text-black" />
                    </button>
                    <button
                        onClick={() => swiperRef.current?.slideNext()}
                        disabled={isEnd}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-light bg-white hover:bg-neutral-50 transition-colors disabled:opacity-30 disabled:cursor-default"
                    >
                        <ChevronRight className="w-4 h-4 text-black" />
                    </button>
                </div>
            </div>
            <Swiper
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                    setIsBeginning(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                }}
                onSlideChange={(swiper) => {
                    setIsBeginning(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                }}
                modules={[Navigation]}
                spaceBetween={16}
                slidesPerView={1.2}
                breakpoints={{
                    640: { slidesPerView: 2.1 },
                    1024: { slidesPerView: 3.05 },
                }}
                className="w-full overflow-visible!"
            >
                {children}
            </Swiper>
        </div>
    );
}

function SectionSkeleton({ label }: { label: string }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-1">
                <span className="font-['Poppins',sans-serif] font-bold text-[20px] text-black">{label}</span>
                <ChevronRight className="w-5 h-5 text-neutral-300" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-[10px] overflow-hidden flex flex-col">
                        <Skeleton className="w-full h-[175px]" />
                        <div className="p-5 flex flex-col gap-3">
                            <Skeleton className="h-5 w-3/4 rounded" />
                            <Skeleton className="h-3 w-full rounded" />
                            <Skeleton className="h-3 w-2/3 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TalentSectionSkeleton({ label }: { label: string }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-1">
                <span className="font-['Poppins',sans-serif] font-bold text-[20px] text-black">{label}</span>
                <ChevronRight className="w-5 h-5 text-neutral-300" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-[10px] p-5 flex flex-col gap-3">
                        <div className="flex items-start gap-4">
                            <Skeleton className="w-[70px] h-[70px] rounded-full shrink-0" />
                            <div className="flex flex-col gap-2 flex-1">
                                <Skeleton className="h-5 w-2/3 rounded" />
                                <div className="flex gap-1.5">
                                    <Skeleton className="h-[26px] w-24 rounded-[5px]" />
                                    <Skeleton className="h-[26px] w-20 rounded-[5px]" />
                                </div>
                            </div>
                        </div>
                        <Skeleton className="h-3 w-full rounded" />
                        <Skeleton className="h-3 w-4/5 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Section Projets ──────────────────────────────────────────────────────────

function ProjectsTab() {
    const { data: projects, isPending } = useProjects();

    const [filtersOpen, setFiltersOpen] = useState(false);
    const [filterType, setFilterType] = useState("");
    const [filterLocation, setFilterLocation] = useState("");
    const [filterRoles, setFilterRoles] = useState("");
    const [filterDates, setFilterDates] = useState("");
    const [filterLevel, setFilterLevel] = useState("");
    const [filterRemu, setFilterRemu] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    const hasActiveFilters = !!(filterType || filterLocation || filterRoles || filterDates || filterLevel || filterRemu);

    function resetFilters() {
        setFilterType(""); setFilterLocation(""); setFilterRoles("");
        setFilterDates(""); setFilterLevel(""); setFilterRemu("");
    }

    const published = useMemo(
        () => projects?.filter((p) => p.status === "PUBLISHED") ?? [],
        [projects]
    );

    const filtered = useMemo(() => {
        return published.filter((p) => {
            if (filterType && p.projectType?.toLowerCase() !== filterType.toLowerCase()) return false;
            if (filterLevel && p.level !== LEVEL_VALUES[filterLevel]) return false;
            if (filterRemu && p.remunerationType !== REMUNERATION_VALUES[filterRemu]) return false;
            if (filterLocation) {
                const locMatch = p.mapLocation?.name?.toLowerCase().includes(filterLocation.toLowerCase());
                const modeMatch = p.workMode === WORKMODE_VALUES[filterLocation];
                if (!locMatch && !modeMatch) return false;
            }
            return true;
        });
    }, [published, filterType, filterLevel, filterRemu, filterLocation]);

    const byType = useMemo(() => {
        const knownTypes = PROJECT_TYPES.map((t) => t.toLowerCase());
        const map = new Map<string, ProjectWithOwner[]>();
        for (const type of PROJECT_TYPES) {
            const items = filtered.filter((p) => p.projectType?.toLowerCase() === type.toLowerCase());
            if (items.length > 0) map.set(type, items);
        }
        const otherItems = filtered.filter((p) => !p.projectType || !knownTypes.includes(p.projectType.toLowerCase()));
        if (otherItems.length > 0) map.set("Autre", [...(map.get("Autre") ?? []), ...otherItems]);
        return map;
    }, [filtered]);

    return (
        <>
            {/* Filtre */}
            <FiltersPanel
                filtersOpen={filtersOpen}
                setFiltersOpen={setFiltersOpen}
                hasActiveFilters={hasActiveFilters}
            >
                <FilterSelect label="Type de projets" options={PROJECT_TYPES} value={filterType} onChange={setFilterType} />
                <FilterSelect label="Lieu" options={WORKMODE_OPTIONS} value={filterLocation} onChange={setFilterLocation} />
                <FilterSelect label="Rôles" options={[]} value={filterRoles} onChange={setFilterRoles} />
                <FilterSelect label="Dates" options={[]} value={filterDates} onChange={setFilterDates} />
                <FilterSelect label="Niveau" options={LEVEL_OPTIONS} value={filterLevel} onChange={setFilterLevel} />
                <FilterSelect label="Rémunération" options={REMUNERATION_OPTIONS} value={filterRemu} onChange={setFilterRemu} />
            </FiltersPanel>

            {/* Contenu */}
            {isPending ? (
                <div className="flex flex-col gap-10">
                    {PROJECT_TYPES.slice(0, 3).map((type) => (
                        <SectionSkeleton key={type} label={type} />
                    ))}
                </div>
            ) : byType.size === 0 ? (
                <EmptyState
                    icon={<Briefcase className="w-8 h-8 text-neutral-300" />}
                    title="Aucun projet trouvé"
                    subtitle={hasActiveFilters ? "Essayez d'autres filtres." : "Soyez le premier à publier un projet !"}
                    hasFilters={hasActiveFilters}
                    onReset={resetFilters}
                />
            ) : (
                <div className="flex flex-col gap-10">
                    {Array.from(byType.entries()).map(([type, items]) => (
                        <CarouselSection
                            key={type}
                            label={type}
                            href={`/marketplace/categories/${encodeURIComponent(type)}`}
                            count={items.length}
                        >
                            {items.map((project) => (
                                <SwiperSlide key={project.id} className="h-auto">
                                    <ProjectCard project={project} />
                                </SwiperSlide>
                            ))}
                        </CarouselSection>
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
        </>
    );
}

// ─── Section Talents ──────────────────────────────────────────────────────────

function TalentsTab() {
    const { data: talents, isPending } = useTalents();

    const [filtersOpen, setFiltersOpen] = useState(false);
    const [filterSpec, setFilterSpec] = useState("");
    const [filterLocation, setFilterLocation] = useState("");
    const [filterRoles, setFilterRoles] = useState("");
    const [filterDates, setFilterDates] = useState("");
    const [filterLevel, setFilterLevel] = useState("");
    const [filterRemu, setFilterRemu] = useState("");

    const hasActiveFilters = !!(filterSpec || filterLocation || filterRoles || filterDates || filterLevel || filterRemu);

    function resetFilters() {
        setFilterSpec(""); setFilterLocation(""); setFilterRoles("");
        setFilterDates(""); setFilterLevel(""); setFilterRemu("");
    }

    // Grouper par première spécialité (premier badge)
    const bySpecialty = useMemo(() => {
        const map = new Map<string, Talent[]>();
        const list = talents ?? [];

        for (const talent of list) {
            if (talent.badges.length === 0) {
                const bucket = map.get("Autre") ?? [];
                bucket.push(talent);
                map.set("Autre", bucket);
            } else {
                // Filtrer par spécialité si actif
                if (filterSpec && !talent.badges.some((b) => b.name.toLowerCase() === filterSpec.toLowerCase())) continue;

                const specialty = talent.badges[0].name;
                const bucket = map.get(specialty) ?? [];
                bucket.push(talent);
                map.set(specialty, bucket);
            }
        }

        return map;
    }, [talents, filterSpec]);

    // Liste des spécialités disponibles pour le filtre
    const specialties = useMemo(() => {
        const set = new Set<string>();
        (talents ?? []).forEach((t) => t.badges.forEach((b) => set.add(b.name)));
        return Array.from(set).sort();
    }, [talents]);

    return (
        <>
            {/* Filtre */}
            <FiltersPanel
                filtersOpen={filtersOpen}
                setFiltersOpen={setFiltersOpen}
                hasActiveFilters={hasActiveFilters}
            >
                <FilterSelect label="Type de projets" options={specialties} value={filterSpec} onChange={setFilterSpec} />
                <FilterSelect label="Lieu" options={WORKMODE_OPTIONS} value={filterLocation} onChange={setFilterLocation} />
                <FilterSelect label="Rôles" options={[]} value={filterRoles} onChange={setFilterRoles} />
                <FilterSelect label="Dates" options={[]} value={filterDates} onChange={setFilterDates} />
                <FilterSelect label="Niveau" options={LEVEL_OPTIONS} value={filterLevel} onChange={setFilterLevel} />
                <FilterSelect label="Rémunération" options={REMUNERATION_OPTIONS} value={filterRemu} onChange={setFilterRemu} />
            </FiltersPanel>

            {/* Contenu */}
            {isPending ? (
                <div className="flex flex-col gap-10">
                    {["Motion design", "Animation", "3D"].map((spec) => (
                        <TalentSectionSkeleton key={spec} label={spec} />
                    ))}
                </div>
            ) : bySpecialty.size === 0 ? (
                <EmptyState
                    icon={<Users className="w-8 h-8 text-neutral-300" />}
                    title="Aucun talent trouvé"
                    subtitle={hasActiveFilters ? "Essayez d'autres filtres." : "Aucun talent n'a encore rejoint la plateforme."}
                    hasFilters={hasActiveFilters}
                    onReset={resetFilters}
                />
            ) : (
                <div className="flex flex-col gap-10">
                    {Array.from(bySpecialty.entries()).map(([specialty, items]) => (
                        <CarouselSection
                            key={specialty}
                            label={specialty}
                            count={items.length}
                        >
                            {items.map((talent) => (
                                <SwiperSlide key={talent.id} className="h-auto">
                                    <TalentCard talent={talent} />
                                </SwiperSlide>
                            ))}
                        </CarouselSection>
                    ))}
                </div>
            )}
        </>
    );
}

// ─── Sous-composants utilitaires ──────────────────────────────────────────────

function FiltersPanel({
    filtersOpen,
    setFiltersOpen,
    hasActiveFilters,
    children,
}: {
    filtersOpen: boolean;
    setFiltersOpen: (v: boolean) => void;
    hasActiveFilters: boolean;
    children: React.ReactNode;
}) {
    return (
        <div>
            <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="flex items-center gap-2 font-['Poppins',sans-serif] font-medium text-[16px] text-black relative"
            >
                <Filter className="w-4 h-4" />
                Filtre
                {hasActiveFilters && (
                    <span className="absolute -top-1 -right-2.5 w-2.5 h-2.5 rounded-full bg-orange" />
                )}
            </button>
            <div
                className={cn("overflow-hidden transition-all duration-300 ease-in-out", {
                    "max-h-[400px] opacity-100 mt-3": filtersOpen,
                    "max-h-0 opacity-0": !filtersOpen
                })}
            >
                <div className="bg-white rounded-[10px] p-6 grid grid-cols-2 gap-x-10 gap-y-5">
                    {children}
                </div>
            </div>
        </div>
    );
}

function EmptyState({
    icon,
    title,
    subtitle,
    hasFilters,
    onReset,
}: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    hasFilters: boolean;
    onReset: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="p-4 rounded-full bg-neutral-100">{icon}</div>
            <div className="text-center">
                <p className="font-['Poppins',sans-serif] font-semibold text-[#4c4a43]">{title}</p>
                <p className="font-['Poppins',sans-serif] text-sm text-gray mt-1">{subtitle}</p>
            </div>
            {hasFilters && (
                <button className="text-sm text-orange underline font-['Poppins',sans-serif]" onClick={onReset}>
                    Réinitialiser les filtres
                </button>
            )}
        </div>
    );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function MarketplacePageClient() {
    const [activeTab, setActiveTab] = useState<"projets" | "talents">("projets");

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
            {/* Tabs Projets / Talents */}
            <div className="flex items-center gap-0 bg-white rounded-[5px] p-1 w-fit">
                <button
                    onClick={() => setActiveTab("projets")}
                    className={cn("px-6 py-2 rounded-lg font-['Poppins',sans-serif] font-medium text-[16px] leading-6 transition-colors", {
                        "bg-black text-white": activeTab === "projets",
                        "text-[#4c4a43] hover:bg-neutral-50": activeTab !== "projets"
                    })}
                >
                    Projets
                </button>
                <button
                    onClick={() => setActiveTab("talents")}
                    className={cn("px-6 py-2 rounded-lg font-['Poppins',sans-serif] font-medium text-[16px] leading-6 transition-colors", {
                        "bg-black text-white": activeTab === "talents",
                        "text-[#4c4a43] hover:bg-neutral-50": activeTab !== "talents"
                    })}
                >
                    Talents
                </button>
            </div>

            {activeTab === "projets" ? <ProjectsTab /> : <TalentsTab />}
        </div>
    );
}
