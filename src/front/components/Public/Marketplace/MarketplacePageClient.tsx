"use client";

import { CreateProjectForm } from "@/front/components/Private/Global/CreateProjectForm";
import { TalentProfileModal } from "@/front/components/Private/Global/TalentProfileModal";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/front/components/ui/dialog";
import { useUser } from "@/front/states/contexts/user.context";
import { useMarketplaceStore } from "@/front/states/stores/marketplace.store";
import { cn } from "@/front/lib/utils";
import { Filter } from "lucide-react";
import { useQueryStates } from "nuqs";
import { allMarketplaceParsers } from "./marketplace.params";
import { ProjectsTab } from "./Projects/ProjectsTab";
import { TalentsTab } from "./Talents/TalentsTab";

export default function MarketplacePageClient() {
    const user = useUser();
    const { filtersOpen, toggleFilters, setFiltersOpen, projectModalOpen, setProjectModalOpen, talentModalOpen, setTalentModalOpen } = useMarketplaceStore();

    const [{ tab, pType, pWorkMode, pLevel, pRemu, pCity, pDate, tRole, tWorkMode, tLevel, tRemu }, setParams] = useQueryStates(allMarketplaceParsers, { shallow: true, scroll: false });

    const activeTab = tab === "talents" ? "talents" : "projets";

    const hasActiveFilters = activeTab === "projets"
        ? !!(pType || pWorkMode || pLevel || pRemu || pCity || pDate)
        : !!(tRole || tWorkMode || tLevel || tRemu);

    const isNewUser = !!user && Date.now() - new Date(user.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;
    const isTalent = user?.isMarketplaceTalent ?? false;

    function handleTabChange(tab: "projets" | "talents") {
        setFiltersOpen(false);
        setParams({ tab });
    }

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
            <h1 className="text-2xl font-semibold">Marketplace</h1>
            <div className="flex items-center justify-between">
                <div className="flex items-center bg-white rounded-[5px] p-1 w-fit">
                    {(["projets", "talents"] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => handleTabChange(t)}
                            className={cn(
                                "px-6 py-2 rounded-lg font-['Poppins',sans-serif] font-medium text-[16px] leading-6 transition-colors",
                                activeTab === t ? "bg-black text-white" : "text-[#4c4a43] hover:bg-neutral-50"
                            )}
                        >
                            {t === "projets" ? "Projets" : "Talents"}
                        </button>
                    ))}
                </div>

                <button
                    onClick={toggleFilters}
                    className={cn(
                        "relative flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer",
                        filtersOpen || hasActiveFilters
                            ? "border-orange bg-orange text-white"
                            : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                    )}
                >
                    <Filter className="w-4 h-4" />
                    Filtres
                    {hasActiveFilters && !filtersOpen && (
                        <span className="w-2 h-2 rounded-full bg-white" />
                    )}
                </button>
            </div>

            {
                activeTab === "projets" ? (
                    <ProjectsTab
                        isNewUser={isNewUser}
                        onOpenProjectModal={() => setProjectModalOpen(true)}
                    />
                ) : (
                    <TalentsTab
                        isNewUser={isNewUser}
                        isTalent={isTalent}
                        onOpenTalentModal={() => setTalentModalOpen(true)}
                    />
                )
            }

            <Dialog open={projectModalOpen} onOpenChange={setProjectModalOpen}>
                <DialogContent className="p-0 gap-0 w-full max-w-2xl max-h-[85vh] flex overflow-hidden rounded-xl">
                    <DialogTitle className="sr-only">Publier un projet</DialogTitle>
                    <DialogDescription className="sr-only">Formulaire de création de projet</DialogDescription>
                    <div className="flex-1 overflow-y-auto p-6">
                        <CreateProjectForm onSuccess={() => setProjectModalOpen(false)} />
                    </div>
                </DialogContent>
            </Dialog>

            <TalentProfileModal open={talentModalOpen} onOpenChange={setTalentModalOpen} />
        </div >
    );
}
