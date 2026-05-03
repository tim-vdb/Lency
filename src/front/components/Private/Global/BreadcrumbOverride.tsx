"use client";

import { useBreadcrumbOverride } from "@/front/hooks/use-breadcrumb-override";

interface BreadcrumbOverrideProps {
    segment: string | undefined | null;
    label: string | undefined | null;
    type?: "category";
}

export default function BreadcrumbOverride({ segment, label, type }: BreadcrumbOverrideProps) {
    useBreadcrumbOverride(segment, label, type);
    return null;
}
