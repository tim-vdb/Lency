"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/front/components/ui/breadcrumb";
import { cn } from "@/front/lib/utils";
import { useBreadcrumbOverrides } from "@/front/stores/use-breadcrumb-overrides.store";
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
    billing: "Facturation",
    blog: "Blog",
    users: "Utilisateurs",
    categories: "Catégories",
    create: "Créer",
};

const HIDDEN_SEGMENTS = new Set(["post"]);
const PRIVATE_SECTIONS = new Set(["dashboard", "account", "admin"]);

const CATEGORY_BADGE_PALETTE = [
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    "bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300",
];

function colorForSegment(segment: string) {
    let hash = 0;
    for (let i = 0; i < segment.length; i++) hash = (hash * 31 + segment.charCodeAt(i)) >>> 0;
    return CATEGORY_BADGE_PALETTE[hash % CATEGORY_BADGE_PALETTE.length];
}

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
            const label = override?.label ?? SEGMENT_LABELS[segment] ?? decoded;
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
                                        className={cn(
                                            "hidden md:inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium transition-opacity hover:opacity-80",
                                            colorForSegment(item.segment)
                                        )}
                                    >
                                        {item.label}
                                    </BreadcrumbLink>
                                ) : (
                                    <BreadcrumbLink
                                        href={item.href}
                                        className="hidden md:block text-black dark:text-white"
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
