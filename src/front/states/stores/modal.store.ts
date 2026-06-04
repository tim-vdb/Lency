"use client";

import { create } from "zustand";

export type ModalType = "authPrompt" | "confirm" | "alert";

interface Modal {
    id: string;
    type: ModalType;
    props?: Record<string, unknown>;
}

interface ModalStore {
    modals: Modal[];
    openModal: (type: ModalType, props?: Record<string, unknown>) => string;
    closeModal: (id: string) => void;
    closeAllModals: () => void;
}

let modalIdCounter = 0;

export const useModalStore = create<ModalStore>()((set) => ({
    modals: [],
    openModal: (type, props) => {
        const id = `modal-${++modalIdCounter}`;
        set((s) => ({
            modals: [...s.modals, { id, type, props }],
        }));
        return id;
    },
    closeModal: (id) => {
        set((s) => ({
            modals: s.modals.filter((m) => m.id !== id),
        }));
    },
    closeAllModals: () => {
        set({ modals: [] });
    },
}));
