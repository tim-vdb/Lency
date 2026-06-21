"use client";

import { Input } from "@/front/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/front/components/ui/select";
import { Search } from "lucide-react";
import { WorkMode, ProjectLevel, RemunerationType } from "@/back/generated/prisma_client/edge";

const WORK_MODE_LABELS: Record<WorkMode, string> = {
    PRESENTIEL: "Présentiel",
    DISTANCIEL: "Distanciel",
    HYBRIDE: "Hybride",
};

const LEVEL_LABELS: Record<ProjectLevel, string> = {
    DEBUTANT: "Débutant",
    INTERMEDIAIRE: "Intermédiaire",
    AVANCE: "Avancé",
};

const REMUNERATION_LABELS: Record<RemunerationType, string> = {
    NON_REMUNERE: "Non rémunéré",
    REMUNERE: "Rémunéré",
};

export interface TalentFiltersValues {
    workMode: string;
    level: string;
    remuneration: string;
    roles: string;
}

interface TalentFiltersProps {
    values: TalentFiltersValues;
    onChange: <K extends keyof TalentFiltersValues>(key: K, value: TalentFiltersValues[K]) => void;
}

export default function TalentFilters({ values, onChange }: TalentFiltersProps) {
    return (
        <div className="grid grid-cols-2 gap-3">
            {/* Mode de travail */}
            <Select value={values.workMode} onValueChange={(v) => onChange("workMode", v)}>
                <SelectTrigger className="border-[#E8E8E1] text-[#4C4A43] text-[13px]">
                    <SelectValue placeholder="Mode de travail" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Tout">Tous les modes</SelectItem>
                    {Object.values(WorkMode).map((w) => (
                        <SelectItem key={w} value={w}>{WORK_MODE_LABELS[w]}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Niveau d'expérience */}
            <Select value={values.level} onValueChange={(v) => onChange("level", v)}>
                <SelectTrigger className="border-[#E8E8E1] text-[#4C4A43] text-[13px]">
                    <SelectValue placeholder="Niveau d'expérience" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Tout">Tous les niveaux</SelectItem>
                    {Object.values(ProjectLevel).map((l) => (
                        <SelectItem key={l} value={l}>{LEVEL_LABELS[l]}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Type de rémunération */}
            <Select value={values.remuneration} onValueChange={(v) => onChange("remuneration", v)}>
                <SelectTrigger className="border-[#E8E8E1] text-[#4C4A43] text-[13px]">
                    <SelectValue placeholder="Rémunération" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Tout">Toutes</SelectItem>
                    {Object.values(RemunerationType).map((r) => (
                        <SelectItem key={r} value={r}>{REMUNERATION_LABELS[r]}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Rôles (recherche texte) */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8A85] pointer-events-none" />
                <Input
                    placeholder="Rôle (ex: monteur...)"
                    value={values.roles}
                    onChange={(e) => onChange("roles", e.target.value)}
                    className="pl-9 border-[#E8E8E1] text-[#4C4A43] placeholder:text-[#8C8A85] text-[13px]"
                />
            </div>
        </div>
    );
}
