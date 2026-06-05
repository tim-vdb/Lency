"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/front/components/ui/breadcrumb";
import { useBreadcrumbOverrides } from "@/front/states/stores/breadcrumb-overrides.store";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

const SEGMENT_LABELS: Record<string, string> = {
    community: "Communauté",
    resources: "Ressources",
    marketplace: "Marketplace",
    user: "Profil",
    dashboard: "Dashboard",
    account: "Compte",
    admin: "Admin",
    badges: "Succès",
    settings: "Paramètres",
    profile: "Profil",
    notifs: "Notifications",
    security: "Sécurité",
    blog: "Blog",
    users: "Utilisateurs",
    categories: "Catégories",
    create: "Créer",
};

const HIDDEN_SEGMENTS = new Set(["post"]);
const PRIVATE_SECTIONS = new Set(["dashboard", "account", "admin"]);


export default function BreadcrumbAuto() {
    const pathname = usePathname();
    const overrides = useBreadcrumbOverrides((s) => s.overrides);
    const segments = pathname.split("/").filter(Boolean);

    const firstSegment = segments[0];
    const isPrivateSection = firstSegment ? PRIVATE_SECTIONS.has(firstSegment) : false;

    const items = segments
        .filter((segment) => !HIDDEN_SEGMENTS.has(segment))
        .map((segment, index, filtered) => {
            const decoded = decodeURIComponent(segment);
            const override = overrides[segment];
            const isId = !SEGMENT_LABELS[segment] && /^[a-z0-9]{20,}$|^[0-9a-f-]{36}$/.test(decoded);
            const label = override?.label ?? SEGMENT_LABELS[segment] ?? (isId ? "…" : decoded);
            const isCategory = override?.type === "category";
            const originalIndex = segments.indexOf(segment);
            const href = "/" + segments.slice(0, originalIndex + 1).join("/");
            return { label, href, isLast: index === filtered.length - 1, isCategory, segment };
        });

    if (items.length === 0) {
        return (
            <Breadcrumb className="flex items-center gap-2">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-black dark:text-white">Accueil</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        );
    }

    return (
        <Breadcrumb className="flex items-center gap-2">
            <BreadcrumbList>
                {!isPrivateSection && (
                    <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="/" className="text-black dark:text-white">
                            Accueil
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                )}
                {items.map((item, index) => {
                    const showSeparator = !isPrivateSection || index > 0;
                    return (
                        <Fragment key={item.href}>
                            {showSeparator && (
                                <BreadcrumbSeparator className="hidden md:block text-black dark:text-white" />
                            )}
                            <BreadcrumbItem>
                                {item.isLast ? (
                                    <BreadcrumbPage className="text-black dark:text-white truncate max-w-[200px]">
                                        {item.label}
                                    </BreadcrumbPage>
                                ) : item.isCategory ? (
                                    <BreadcrumbLink
                                        href={item.href}
                                        className="hidden md:inline-flex items-center rounded-sm text-sm font-medium text-black dark:text-white"
                                    >
                                        {item.label}
                                    </BreadcrumbLink>
                                ) : (
                                    <BreadcrumbLink
                                        href={item.href}
                                        className="hidden md:block text-black text-sm dark:text-white"
                                    >
                                        {item.label}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
