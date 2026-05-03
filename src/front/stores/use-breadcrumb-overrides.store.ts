"use client";

import { create } from "zustand";

export interface BreadcrumbOverride {
    label: string;
    type?: "category";
}

interface BreadcrumbOverridesStore {
    overrides: Record<string, BreadcrumbOverride>;
    setOverride: (segment: string, label: string, type?: "category") => void;
    clearOverride: (segment: string) => void;
}

export const useBreadcrumbOverrides = create<BreadcrumbOverridesStore>((set) => ({
    overrides: {},
    setOverride: (segment, label, type) =>
        set((state) => {
            const current = state.overrides[segment];
            if (current?.label === label && current?.type === type) return state;
            return { overrides: { ...state.overrides, [segment]: { label, type } } };
        }),
    clearOverride: (segment) =>
        set((state) => {
            if (!(segment in state.overrides)) return state;
            const next = { ...state.overrides };
            delete next[segment];
            return { overrides: next };
        }),
}));
