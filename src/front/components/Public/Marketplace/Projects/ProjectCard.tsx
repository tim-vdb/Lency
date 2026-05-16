"use client";

import { Badge } from "@/front/components/ui/badge";
import { Button } from "@/front/components/ui/button";
import { Card, CardContent } from "@/front/components/ui/card";
import { cn, getDisplayName, getInitialName, timeAgo } from "@/front/lib/utils";
import { ProjectWithOwner } from "@/front/types/project.schema";
import { Briefcase, CalendarDays, Lock, MapPin, MessageCircle, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/front/components/ui/avatar";

const STATUS_COLORS: Record<string, string> = {
    PUBLISHED: "bg-emerald-100 text-emerald-700",
    DRAFT: "bg-neutral-100 text-neutral-600",
    ARCHIVED: "bg-amber-100 text-amber-700",
};

const VISIBILITY_COLORS: Record<string, string> = {
    PUBLIC: "bg-sky-100 text-sky-700",
    PRIVATE: "bg-rose-100 text-rose-700",
    MEMBERS_ONLY: "bg-violet-100 text-violet-700",
};

export default function ProjectCard({ project }: { project: ProjectWithOwner }) {
    const roles = Array.isArray(project.roles) ? (project.roles as string[]) : [];

    return (
        <Link href={`/marketplace/${project.id}`} className="block group">
            <Card className="overflow-hidden py-0 gap-0 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                {/* Banner */}
                <div className="relative w-full h-40 bg-linear-to-br from-neutral-100 via-neutral-50 to-neutral-200 overflow-hidden">
                    {project.bannerUrl ? (
                        <Image
                            src={project.bannerUrl}
                            alt={project.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                    ) : (
                        <div className="w-full h-full bg-linear-to-br from-orange-50 via-pink-50 to-violet-100 flex items-center justify-center">
                            <Briefcase className="w-12 h-12 text-neutral-300" />
                        </div>
                    )}
                    {/* Badges overlay */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        <Badge variant="secondary" className={cn("text-xs font-medium border-0", STATUS_COLORS[project.status] ?? STATUS_COLORS.DRAFT)}>
                            {project.status === "PUBLISHED" ? "Publié" : project.status === "DRAFT" ? "Brouillon" : "Archivé"}
                        </Badge>
                        {project.visibility !== "PUBLIC" && (
                            <Badge variant="secondary" className={cn("text-xs font-medium border-0 flex items-center gap-1", VISIBILITY_COLORS[project.visibility])}>
                                <Lock className="w-2.5 h-2.5" />
                                {project.visibility === "PRIVATE" ? "Privé" : "Membres"}
                            </Badge>
                        )}
                    </div>
                    {/* Participants overlay */}
                    {project.participants.length > 0 && (
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {project.participants.length}
                        </div>
                    )}
                </div>

                <CardContent className="p-4 flex flex-col gap-3">
                    {/* Title */}
                    <h3 className="font-bold text-base leading-tight line-clamp-2 uppercase group-hover:text-orange transition-colors">
                        {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed">
                        {project.description}
                    </p>

                    {/* Meta */}
                    <div className="flex flex-col gap-1.5">
                        {project.projectType && (
                            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                                <Briefcase className="w-3.5 h-3.5 shrink-0" />
                                <span>{project.projectType}</span>
                            </div>
                        )}
                        {project.mapLocation && (
                            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                                <MapPin className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">{project.mapLocation.name}</span>
                            </div>
                        )}
                        {project.startDate && (
                            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                                <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                                <span>
                                    Début {new Date(project.startDate).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Roles */}
                    {roles.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {roles.slice(0, 3).map((role, i) => (
                                <Badge key={i} variant="secondary" className="text-xs font-normal bg-neutral-100 text-neutral-600">
                                    {role}
                                </Badge>
                            ))}
                            {roles.length > 3 && (
                                <Badge variant="secondary" className="text-xs font-normal bg-neutral-100 text-neutral-500">
                                    +{roles.length - 3}
                                </Badge>
                            )}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
                        <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                                <AvatarImage src={project.owner.image ?? undefined} />
                                <AvatarFallback className="text-[10px] bg-neutral-100">
                                    {getInitialName(project.owner)}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-neutral-500 truncate max-w-[100px]">
                                {getDisplayName(project.owner)}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-neutral-400">
                            {project.commentCount > 0 && (
                                <span className="flex items-center gap-1">
                                    <MessageCircle className="w-3 h-3" />
                                    {project.commentCount}
                                </span>
                            )}
                            <span>{timeAgo(project.createdAt)}</span>
                        </div>
                    </div>

                    <Button size="sm" className="w-full mt-1" onClick={(e) => e.preventDefault()}>
                        Voir le projet
                    </Button>
                </CardContent>
            </Card>
        </Link>
    );
}
