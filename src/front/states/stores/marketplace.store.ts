"use client";

import { create } from "zustand";

interface MarketplaceStore {
    filtersOpen: boolean;
    setFiltersOpen: (v: boolean) => void;
    toggleFilters: () => void;
    projectModalOpen: boolean;
    setProjectModalOpen: (v: boolean) => void;
    talentModalOpen: boolean;
    setTalentModalOpen: (v: boolean) => void;
}

export const useMarketplaceStore = create<MarketplaceStore>()((set) => ({
    filtersOpen: false,
    setFiltersOpen: (v) => set({ filtersOpen: v }),
    toggleFilters: () => set((s) => ({ filtersOpen: !s.filtersOpen })),
    projectModalOpen: false,
    setProjectModalOpen: (v) => set({ projectModalOpen: v }),
    talentModalOpen: false,
    setTalentModalOpen: (v) => set({ talentModalOpen: v }),
}));
