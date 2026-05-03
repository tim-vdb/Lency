"use client";

import { useEffect } from "react";
import { useBreadcrumbOverrides } from "@/front/stores/use-breadcrumb-overrides.store";

export function useBreadcrumbOverride(
    segment: string | undefined | null,
    label: string | undefined | null,
    type?: "category"
) {
    const setOverride = useBreadcrumbOverrides((s) => s.setOverride);
    const clearOverride = useBreadcrumbOverrides((s) => s.clearOverride);

    useEffect(() => {
        if (!segment || !label) return;
        setOverride(segment, label, type);
        return () => clearOverride(segment);
    }, [segment, label, type, setOverride, clearOverride]);
}
