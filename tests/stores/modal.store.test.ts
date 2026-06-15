import { describe, it, expect, beforeEach } from "vitest";
import { useModalStore } from "@/front/states/stores/modal.store";

describe("useModalStore", () => {
    beforeEach(() => {
        useModalStore.setState({ modals: [] });
    });

    it("starts with an empty modals array", () => {
        expect(useModalStore.getState().modals).toEqual([]);
    });

    it("opens a modal and returns its id", () => {
        const id = useModalStore.getState().openModal("authPrompt");
        expect(id).toMatch(/^modal-/);
        expect(useModalStore.getState().modals).toHaveLength(1);
        expect(useModalStore.getState().modals[0].type).toBe("authPrompt");
    });

    it("opens multiple modals", () => {
        useModalStore.getState().openModal("authPrompt");
        useModalStore.getState().openModal("confirm", { message: "OK?" });
        expect(useModalStore.getState().modals).toHaveLength(2);
        expect(useModalStore.getState().modals[0].type).toBe("authPrompt");
        expect(useModalStore.getState().modals[1].type).toBe("confirm");
        expect(useModalStore.getState().modals[1].props).toEqual({ message: "OK?" });
    });

    it("generates unique ids for each modal", () => {
        const id1 = useModalStore.getState().openModal("authPrompt");
        const id2 = useModalStore.getState().openModal("alert");
        expect(id1).not.toBe(id2);
    });

    it("closes a specific modal by id", () => {
        const id1 = useModalStore.getState().openModal("authPrompt");
        useModalStore.getState().openModal("confirm");
        useModalStore.getState().closeModal(id1);
        expect(useModalStore.getState().modals).toHaveLength(1);
        expect(useModalStore.getState().modals[0].type).toBe("confirm");
    });

    it("closeModal does nothing for unknown id", () => {
        useModalStore.getState().openModal("alert");
        useModalStore.getState().closeModal("unknown-id");
        expect(useModalStore.getState().modals).toHaveLength(1);
    });

    it("closeAllModals clears all modals", () => {
        useModalStore.getState().openModal("authPrompt");
        useModalStore.getState().openModal("confirm");
        useModalStore.getState().closeAllModals();
        expect(useModalStore.getState().modals).toEqual([]);
    });

    it("handles modal with props", () => {
        const id = useModalStore.getState().openModal("confirm", { title: "Supprimer ?", action: "delete" });
        const modal = useModalStore.getState().modals.find((m) => m.id === id);
        expect(modal?.props).toEqual({ title: "Supprimer ?", action: "delete" });
    });
});
