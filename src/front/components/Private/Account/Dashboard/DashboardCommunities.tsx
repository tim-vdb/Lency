"use client";

import Link from "next/link";
import { Users, FileText, Paperclip } from "lucide-react";
import { useFollowedCategories } from "@/front/queries/categories";

function formatCount(n: number): string {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    return String(n);
}

export function DashboardCommunities() {
    const { data: categories = [], isLoading } = useFollowedCategories();

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-neutral-100 rounded-xl h-64 animate-pulse" />
                ))}
            </div>
        );
    }

    if (categories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-neutral-400 py-16">
                <Users className="w-10 h-10" />
                <p className="text-sm">Tu ne suis aucune communauté pour l&apos;instant.</p>
                <Link href="/community" className="text-sm font-semibold text-primary hover:underline">
                    Découvrir les communautés
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4 pb-2">
            {categories.map((cat) => (
                <Link key={cat.id} href={`/community/${cat.slug}`} className="block group">
                    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-200">
                        {/* Banner */}
                        <div className="relative w-full h-36 bg-neutral-100 shrink-0 overflow-hidden">
                            {cat.bannerUrl ? (
                                <img
                                    src={cat.bannerUrl}
                                    alt={cat.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                                />
                            ) : (
                                <div className="w-full h-full bg-linear-to-br from-orange-50 via-pink-50 to-violet-100" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col gap-2.5">
                            {/* Titre communauté — taille proche du mockup */}
                            <h3 className="text-[18px] font-bold text-black leading-tight line-clamp-1">
                                {cat.name}
                            </h3>
                            {cat.description && (
                                <p className="text-[13px] text-neutral-500 line-clamp-2 leading-5">
                                    {cat.description}
                                </p>
                            )}

                            {/* Stats badges — dark comme sur l'image */}
                            <div className="flex items-center gap-2 flex-wrap mt-1">
                                <span className="flex items-center gap-1.5 bg-neutral-900 text-white rounded-full px-3 py-1 text-[11px] font-medium">
                                    <Users className="w-3 h-3" />
                                    {formatCount(cat.subscriberCount)} Membres
                                </span>
                                <span className="flex items-center gap-1.5 bg-neutral-900 text-white rounded-full px-3 py-1 text-[11px] font-medium">
                                    <FileText className="w-3 h-3" />
                                    {formatCount(cat._count.posts)} Postes
                                </span>
                                <span className="flex items-center gap-1.5 bg-neutral-900 text-white rounded-full px-3 py-1 text-[11px] font-medium">
                                    <Paperclip className="w-3 h-3" />
                                    {formatCount(cat._count.ressources)} Resources
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
