"use client";

import { useTalents } from "@/front/hooks/queries/use-talents";
import { getTalentPreferences, getTalentRoles, type Talent } from "@/front/lib/api/talents";
import { useMarketplaceStore } from "@/front/stores/marketplace.store";
import { Users } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useMemo } from "react";
import { SwiperSlide } from "swiper/react";
import { CarouselSection } from "../CarouselSection";
import { EmptyState } from "../EmptyState";
import { FilterSelect } from "../Filtrage/FilterSelect";
import { FiltersPanel } from "../Filtrage/FiltersPanel";
import { LEVEL_OPTIONS, LEVEL_VALUES, REMUNERATION_OPTIONS, REMUNERATION_VALUES, WORKMODE_OPTIONS, WORKMODE_VALUES } from "../marketplace.constants";
import { talentFilterParsers } from "../marketplace.params";
import { OnboardingTalentCard } from "../OnboardingCards";
import { TalentSkeleton } from "../Skeletons";
import TalentCard from "./TalentCard";

export function TalentsTab({ isNewUser, isTalent, onOpenTalentModal }: {
    isNewUser: boolean;
    isTalent: boolean;
    onOpenTalentModal: () => void;
}) {
    const { data: talents, isPending } = useTalents();
    const { filtersOpen } = useMarketplaceStore();

    const [{ tRole, tWorkMode, tLevel, tRemu }, setFilters] = useQueryStates(talentFilterParsers, { shallow: true, scroll: false });

    const hasActiveFilters = !!(tRole || tWorkMode || tLevel || tRemu);

    function resetFilters() {
        setFilters({ tRole: "", tWorkMode: "", tLevel: "", tRemu: "" });
    }

    const allRoles = useMemo(() => {
        const set = new Set<string>();
        (talents ?? []).forEach((t) => getTalentRoles(t).forEach((r) => set.add(r)));
        return Array.from(set).sort();
    }, [talents]);

    // Applique d'abord les filtres workMode/level/remu (basés sur preferences config)
    const filtered = useMemo(() => {
        return (talents ?? []).filter((talent) => {
            const prefs = getTalentPreferences(talent);
            if (tWorkMode && prefs.workMode !== WORKMODE_VALUES[tWorkMode]) return false;
            if (tLevel && prefs.level !== LEVEL_VALUES[tLevel]) return false;
            if (tRemu && prefs.remunerationType !== REMUNERATION_VALUES[tRemu]) return false;
            return true;
        });
    }, [talents, tWorkMode, tLevel, tRemu]);

    // Puis groupe par rôle (avec filtre tRole)
    const byRole = useMemo(() => {
        const map = new Map<string, Talent[]>();
        for (const talent of filtered) {
            const roles = getTalentRoles(talent);
            if (roles.length === 0) {
                map.set("Autre", [...(map.get("Autre") ?? []), talent]);
                continue;
            }
            if (tRole && !roles.some((r) => r.toLowerCase() === tRole.toLowerCase())) continue;
            const primary = roles[0];
            map.set(primary, [...(map.get(primary) ?? []), talent]);
        }
        if (map.has("Autre")) {
            const autre = map.get("Autre")!;
            map.delete("Autre");
            map.set("Autre", autre);
        }
        return map;
    }, [filtered, tRole]);

    return (
        <div className="flex flex-col gap-6">
            <FiltersPanel open={filtersOpen} hasActiveFilters={hasActiveFilters} onReset={resetFilters}>
                <FilterSelect label="Rôle / Compétence" options={allRoles} value={tRole} onChange={(v) => setFilters({ tRole: v })} />
                <FilterSelect label="Mode de travail" options={WORKMODE_OPTIONS} value={tWorkMode} onChange={(v) => setFilters({ tWorkMode: v })} />
                <FilterSelect label="Niveau" options={LEVEL_OPTIONS} value={tLevel} onChange={(v) => setFilters({ tLevel: v })} />
                <FilterSelect label="Rémunération" options={REMUNERATION_OPTIONS} value={tRemu} onChange={(v) => setFilters({ tRemu: v })} />
            </FiltersPanel>

            {isPending ? (
                <div className="flex flex-col gap-10">
                    {["Monteur vidéo", "Réalisateur", "Motion designer"].map((r) => (
                        <TalentSkeleton key={r} label={r} />
                    ))}
                </div>
            ) : byRole.size === 0 ? (
                <div className="flex flex-col gap-4">
                    {isNewUser && !isTalent && <OnboardingTalentCard onAction={onOpenTalentModal} />}
                    <EmptyState
                        icon={<Users className="w-8 h-8 text-neutral-300" />}
                        title="Aucun talent trouvé"
                        subtitle={hasActiveFilters ? "Essayez d'autres filtres." : "Aucun talent n'a encore rejoint la plateforme."}
                        hasFilters={hasActiveFilters}
                        onReset={resetFilters}
                    />
                </div>
            ) : (
                <div className="flex flex-col gap-8">
                    {isNewUser && !isTalent && <OnboardingTalentCard onAction={onOpenTalentModal} />}
                    {Array.from(byRole.entries()).map(([role, items]) => (
                        <CarouselSection key={role} label={role} count={items.length}>
                            {items.map((talent) => (
                                <SwiperSlide key={talent.id} className="h-auto">
                                    <TalentCard talent={talent} />
                                </SwiperSlide>
                            ))}
                        </CarouselSection>
                    ))}
                </div>
            )}
        </div>
    );
}
