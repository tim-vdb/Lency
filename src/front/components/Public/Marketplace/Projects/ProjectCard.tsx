"use client";

import { Badge } from "@/front/components/ui/badge";
import { Card, CardContent } from "@/front/components/ui/card";
import { ProjectWithOwner } from "@/front/types/project.schema";
import { CalendarRange } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const LEVEL_LABEL: Record<string, string> = {
    DEBUTANT: "Débutant",
    INTERMEDIAIRE: "Intermédiaire",
    AVANCE: "Avancé",
};

const WORKMODE_LABEL: Record<string, string> = {
    PRESENTIEL: "Présentiel",
    DISTANCIEL: "Distanciel",
    HYBRIDE: "Hybride",
};

const REMUNERATION_LABEL: Record<string, string> = {
    NON_REMUNERE: "Non rémunéré",
    REMUNERE: "Rémunéré",
};

export default function ProjectCard({ project }: { project: ProjectWithOwner }) {
    const roles = Array.isArray(project.roles) ? (project.roles as string[]) : [];

    const dateLabel = project.startDate
        ? new Date(project.startDate).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
        : null;
    const dateFmt = dateLabel
        ? dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)
        : null;

    const cityName = project.mapLocation?.name ?? null;
    const workMode = project.workMode ? WORKMODE_LABEL[project.workMode] ?? null : null;
    const locationLine = [cityName, workMode].filter(Boolean).join(" / ");
    const levelLine = project.level ? LEVEL_LABEL[project.level] ?? null : null;
    const remuLine = project.remunerationType ? REMUNERATION_LABEL[project.remunerationType] ?? null : null;

    const metaRows = [locationLine, levelLine, remuLine].filter(Boolean) as string[];
    const hasLeftBox = metaRows.length > 0;

    return (
        <Link href={`/marketplace/${project.id}`} className="block group h-full">
            <Card className="overflow-hidden py-0 gap-0 h-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                {/* Banner */}
                <div className="relative w-full h-44 overflow-hidden shrink-0 bg-neutral-100">
                    {project.bannerUrl ? (
                        <Image
                            src={project.bannerUrl}
                            alt={project.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                    ) : (
                        <div className="w-full h-full bg-linear-to-br from-orange-50 via-pink-50 to-violet-100" />
                    )}
                    {dateFmt && (
                        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-xs font-semibold px-3 py-1.5 rounded-xl shadow-sm">
                            {dateFmt}
                        </span>
                    )}
                </div>

                <CardContent className="p-5 flex flex-col gap-3 flex-1">
                    {/* Title */}
                    <h3 className="font-bold text-xl leading-snug line-clamp-1">
                        {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">
                        {project.description}
                    </p>

                    {/* Bottom: two bordered boxes */}
                    {(hasLeftBox || roles.length > 0) && (
                        <div className="flex gap-3 mt-1">
                            {/* Left box — meta */}
                            {hasLeftBox && (
                                <div className="flex-1 border border-neutral-200 rounded-xl p-3 flex flex-col gap-2.5 min-w-0">
                                    {metaRows.map((row, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <CalendarRange className="w-4 h-4 shrink-0 text-neutral-500" />
                                            <span className="text-sm text-neutral-700 truncate">{row}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Right box — roles */}
                            {roles.length > 0 && (
                                <div className="flex-1 border border-neutral-200 rounded-xl p-3 flex flex-col gap-2 min-w-0">
                                    <span className="text-xs font-semibold text-neutral-600">Rôles recherchés :</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {roles.slice(0, 4).map((role, i) => (
                                            <Badge
                                                key={i}
                                                variant="secondary"
                                                className="text-xs font-normal bg-neutral-100 text-neutral-600 px-2 py-0.5 h-auto rounded-lg"
                                            >
                                                {role}
                                            </Badge>
                                        ))}
                                        {roles.length > 4 && (
                                            <Badge
                                                variant="secondary"
                                                className="text-xs bg-neutral-100 text-neutral-500 px-2 py-0.5 h-auto rounded-lg"
                                            >
                                                +{roles.length - 4}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}
