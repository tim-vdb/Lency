"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/front/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import React from "react";

const SEGMENT_LABELS: Record<string, string> = {
    community: "Communauté",
    resources: "Ressources",
    user: "Profil",
    post: "Post",
    dashboard: "Dashboard",
    account: "Compte",
    admin: "Admin",
    badges: "Succès",
};

function formatSegment(segment: string, decoded: string) {
    const mapped = SEGMENT_LABELS[segment];
    if (mapped) return mapped;
    return decoded;
}

export default function BreadcrumbAuto() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    const items = segments.map((segment, index) => {
        const decoded = decodeURIComponent(segment);
        const label = formatSegment(segment, decoded);
        const href = "/" + segments.slice(0, index + 1).join("/");
        return { label, href, isLast: index === segments.length - 1 };
    });

    if (items.length === 0) {
        return (
            <Breadcrumb className="flex items-center gap-2">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-black dark:text-white">Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        );
    }

    return (
        <Breadcrumb className="flex items-center gap-2">
            <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/dashboard" className="text-black dark:text-white">
                        Dashboard
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {items.map((item) => (
                    <React.Fragment key={item.href}>
                        <BreadcrumbSeparator className="hidden md:block text-black dark:text-white" />
                        <BreadcrumbItem>
                            {item.isLast ? (
                                <BreadcrumbPage className="text-black dark:text-white">
                                    {item.label}
                                </BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink href={item.href} className="text-black dark:text-white">
                                    {item.label}
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
