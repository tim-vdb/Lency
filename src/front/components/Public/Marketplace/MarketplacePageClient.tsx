"use client";

import { CreateProjectForm } from "@/front/components/Private/Global/CreateProjectForm";
import { TalentProfileModal } from "@/front/components/Private/Global/TalentProfileModal";
import { Dialog, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogTitle } from "@/front/components/ui/dialog";
import { useUser } from "@/front/context/UserContext";
import { useMarketplaceStore } from "@/front/stores/marketplace.store";
import { cn } from "@/front/lib/utils";
import { Filter } from "lucide-react";
import { useQueryStates } from "nuqs";
import { allMarketplaceParsers } from "./marketplace.params";
import { ProjectsTab } from "./Projects/ProjectsTab";
import { TalentsTab } from "./Talents/TalentsTab";

export default function MarketplacePageClient() {
    const user = useUser();
    const { toggleFilters, setFiltersOpen, projectModalOpen, setProjectModalOpen, talentModalOpen, setTalentModalOpen } = useMarketplaceStore();

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
                    className="relative flex items-center gap-2 font-['Poppins',sans-serif] font-medium text-[16px] text-black"
                >
                    <Filter className="w-4 h-4" />
                    Filtre
                    {hasActiveFilters && (
                        <span className="absolute -top-1 -right-2.5 w-2.5 h-2.5 rounded-full bg-orange" />
                    )}
                </button>
            </div>

            {activeTab === "projets" ? (
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
            )}

            <Dialog open={projectModalOpen} onOpenChange={setProjectModalOpen}>
                <DialogPortal>
                    <DialogOverlay />
                    <DialogContent className="p-0 gap-0 w-full max-w-2xl max-h-[85vh] flex overflow-hidden rounded-xl">
                        <DialogTitle className="sr-only">Publier un projet</DialogTitle>
                        <DialogDescription className="sr-only">Formulaire de création de projet</DialogDescription>
                        <div className="flex-1 overflow-y-auto p-6">
                            <CreateProjectForm onSuccess={() => setProjectModalOpen(false)} />
                        </div>
                    </DialogContent>
                </DialogPortal>
            </Dialog>

            <TalentProfileModal open={talentModalOpen} onOpenChange={setTalentModalOpen} />
        </div>
    );
}
