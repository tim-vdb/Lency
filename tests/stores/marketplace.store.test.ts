import { describe, it, expect, beforeEach } from "vitest";
import { useMarketplaceStore } from "@/front/states/stores/marketplace.store";

describe("useMarketplaceStore", () => {
    beforeEach(() => {
        useMarketplaceStore.setState({
            filtersOpen: false,
            projectModalOpen: false,
            talentModalOpen: false,
        });
    });

    it("starts with all states as false", () => {
        const state = useMarketplaceStore.getState();
        expect(state.filtersOpen).toBe(false);
        expect(state.projectModalOpen).toBe(false);
        expect(state.talentModalOpen).toBe(false);
    });

    it("sets filters open", () => {
        useMarketplaceStore.getState().setFiltersOpen(true);
        expect(useMarketplaceStore.getState().filtersOpen).toBe(true);
    });

    it("toggles filters", () => {
        useMarketplaceStore.getState().toggleFilters();
        expect(useMarketplaceStore.getState().filtersOpen).toBe(true);
        useMarketplaceStore.getState().toggleFilters();
        expect(useMarketplaceStore.getState().filtersOpen).toBe(false);
    });

    it("sets project modal open", () => {
        useMarketplaceStore.getState().setProjectModalOpen(true);
        expect(useMarketplaceStore.getState().projectModalOpen).toBe(true);
    });

    it("sets talent modal open", () => {
        useMarketplaceStore.getState().setTalentModalOpen(true);
        expect(useMarketplaceStore.getState().talentModalOpen).toBe(true);
    });

    it("does not affect other states when toggling filters", () => {
        useMarketplaceStore.getState().toggleFilters();
        expect(useMarketplaceStore.getState().projectModalOpen).toBe(false);
        expect(useMarketplaceStore.getState().talentModalOpen).toBe(false);
    });

    it("can set multiple states independently", () => {
        useMarketplaceStore.getState().setFiltersOpen(true);
        useMarketplaceStore.getState().setProjectModalOpen(true);
        useMarketplaceStore.getState().setTalentModalOpen(true);
        const state = useMarketplaceStore.getState();
        expect(state.filtersOpen).toBe(true);
        expect(state.projectModalOpen).toBe(true);
        expect(state.talentModalOpen).toBe(true);
    });
});
