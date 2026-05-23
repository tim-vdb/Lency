"use client";

import { ProjectWithOwner } from "@/front/types/project.schema";
import { MapPin, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
    const dateFmt = dateLabel ? dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1) : null;

    const cityName = project.mapLocation?.name ?? null;
    const workMode = project.workMode ? WORKMODE_LABEL[project.workMode] ?? null : null;
    const locationLine = [cityName, workMode].filter(Boolean).join(" / ");
    const remuLine = project.remunerationType ? REMUNERATION_LABEL[project.remunerationType] ?? null : null;

    return (
        <Link href={`/marketplace/${project.id}`} className="block group h-full">
            <div className="bg-white rounded-[10px] overflow-hidden h-full flex flex-col transition-shadow duration-200 hover:shadow-md">
                {/* Banner */}
                <div className="relative w-full h-[175px] shrink-0 bg-neutral-100">
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
                        <span className="absolute top-3 left-3 bg-white text-black font-['Poppins',sans-serif] font-medium text-[12px] leading-4 px-3 py-1.5 rounded-[5px]">
                            {dateFmt}
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col gap-3 flex-1">
                    <h3 className="font-['Poppins',sans-serif] font-bold text-[20px] leading-7 text-black line-clamp-1">
                        {project.title}
                    </h3>

                    <p className="font-['Poppins',sans-serif] text-[14px] leading-5 text-[#4c4a43] line-clamp-2">
                        {project.description}
                    </p>

                    <div className="flex gap-3 mt-auto pt-2">
                        {/* Rôles recherchés */}
                        {roles.length > 0 && (
                            <div className="flex-1 flex flex-col gap-2 min-w-0">
                                <span className="font-['Poppins',sans-serif] font-medium text-[12px] leading-4 text-black">
                                    Rôles recherchés
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {roles.slice(0, 4).map((role, i) => (
                                        <span
                                            key={i}
                                            className="inline-flex items-center h-[22px] px-3 bg-[#e8e8e1] rounded-lg font-['Poppins',sans-serif] text-[11px] text-black"
                                        >
                                            {role}
                                        </span>
                                    ))}
                                    {roles.length > 4 && (
                                        <span className="inline-flex items-center h-[22px] px-2 bg-[#e8e8e1] rounded-lg font-['Poppins',sans-serif] text-[11px] text-[#4c4a43]">
                                            +{roles.length - 4}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Meta */}
                        {(locationLine || remuLine) && (
                            <div className="flex flex-col gap-2 min-w-0 shrink-0">
                                {locationLine && (
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-[#4c4a43] shrink-0" />
                                        <span className="font-['Poppins',sans-serif] text-[12px] text-[#4c4a43] truncate">
                                            {locationLine}
                                        </span>
                                    </div>
                                )}
                                {remuLine && (
                                    <div className="flex items-center gap-1.5">
                                        <Wallet className="w-3.5 h-3.5 text-[#4c4a43] shrink-0" />
                                        <span className="font-['Poppins',sans-serif] text-[12px] text-[#4c4a43] truncate">
                                            {remuLine}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
