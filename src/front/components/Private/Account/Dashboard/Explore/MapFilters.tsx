"use client"

import { useState } from "react"
import { Input } from "@/front/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/front/components/ui/select"
import { Search } from "lucide-react"
import { ProjectType, ProjectLevel, RemunerationType, WorkMode } from "@/back/generated/prisma_client/edge"
import { AddressAutocompleteInput } from "@/front/components/ui/address-autocomplete-input"

const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
    COURT_METRAGE: "Court-métrage",
    LONG_METRAGE: "Long-métrage",
    SERIE: "Série",
    CLIP: "Clip",
    DOCUMENTAIRE: "Documentaire",
    YOUTUBE: "YouTube",
    AUTRE: "Autre",
}

const LEVEL_LABELS: Record<ProjectLevel, string> = {
    DEBUTANT: "Débutant",
    INTERMEDIAIRE: "Intermédiaire",
    AVANCE: "Avancé",
}

const REMUNERATION_LABELS: Record<RemunerationType, string> = {
    NON_REMUNERE: "Non rémunéré",
    REMUNERE: "Rémunéré",
}

const WORK_MODE_LABELS: Record<WorkMode, string> = {
    PRESENTIEL: "Présentiel",
    DISTANCIEL: "Distanciel",
    HYBRIDE: "Hybride",
}

export interface MapFiltersValues {
    title: string
    projectType: string
    level: string
    remuneration: string
    workMode: string
    dateFrom: string
    dateTo: string
    locationAddress: string
    locationLat: number | null
    locationLon: number | null
}

interface MapFiltersProps {
    titleSuggestions: Array<{ id: string; title: string }>
    values: MapFiltersValues
    onChange: <K extends keyof MapFiltersValues>(key: K, value: MapFiltersValues[K]) => void
}

export default function MapFilters({ titleSuggestions, values, onChange }: MapFiltersProps) {
    const [showTitleSuggestions, setShowTitleSuggestions] = useState(false)

    const handleTitleChange = (v: string) => {
        onChange("title", v)
        setShowTitleSuggestions(v.length > 0)
    }

    const handleSuggestionClick = (title: string) => {
        onChange("title", title)
        setShowTitleSuggestions(false)
    }

    return (
        <div className="grid grid-cols-2 gap-3">
            {/* Lieu */}
            <div className="col-span-2">
                <AddressAutocompleteInput
                    value={values.locationAddress}
                    onChange={(v) => {
                        onChange("locationAddress", v)
                        if (!v) {
                            onChange("locationLat", null)
                            onChange("locationLon", null)
                        }
                    }}
                    onSelect={(_address, lat, lon) => {
                        onChange("locationLat", lat)
                        onChange("locationLon", lon)
                    }}
                    placeholder="Filtrer par lieu…"
                    className="border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:placeholder:text-neutral-500 text-[13px]"
                />
            </div>

            {/* Titre */}
            <div className="relative col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none z-10" />
                <Input
                    placeholder="Chercher un projet..."
                    value={values.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    onFocus={() => values.title.length > 0 && setShowTitleSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowTitleSuggestions(false), 150)}
                    className="pl-9 border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:placeholder:text-neutral-500 text-[13px]"
                />
                {showTitleSuggestions && titleSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-md z-50 max-h-48 overflow-y-auto">
                        {titleSuggestions.map((s) => (
                            <button
                                key={s.id}
                                onMouseDown={() => handleSuggestionClick(s.title)}
                                className="w-full text-left px-3 py-2 text-[13px] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors first:rounded-t-xl last:rounded-b-xl"
                            >
                                {s.title}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Type de projet */}
            <Select value={values.projectType} onValueChange={(v) => onChange("projectType", v)}>
                <SelectTrigger className="border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 text-[13px]">
                    <SelectValue placeholder="Type de projet" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Tout">Tous les types</SelectItem>
                    {Object.values(ProjectType).map((t) => (
                        <SelectItem key={t} value={t}>{PROJECT_TYPE_LABELS[t]}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Niveau */}
            <Select value={values.level} onValueChange={(v) => onChange("level", v)}>
                <SelectTrigger className="border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 text-[13px]">
                    <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Tout">Tous les niveaux</SelectItem>
                    {Object.values(ProjectLevel).map((l) => (
                        <SelectItem key={l} value={l}>{LEVEL_LABELS[l]}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Rémunération */}
            <Select value={values.remuneration} onValueChange={(v) => onChange("remuneration", v)}>
                <SelectTrigger className="border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 text-[13px]">
                    <SelectValue placeholder="Rémunération" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Tout">Toutes</SelectItem>
                    {Object.values(RemunerationType).map((r) => (
                        <SelectItem key={r} value={r}>{REMUNERATION_LABELS[r]}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Mode de travail */}
            <Select value={values.workMode} onValueChange={(v) => onChange("workMode", v)}>
                <SelectTrigger className="border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 text-[13px]">
                    <SelectValue placeholder="Mode de travail" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Tout">Tous les modes</SelectItem>
                    {Object.values(WorkMode).map((w) => (
                        <SelectItem key={w} value={w}>{WORK_MODE_LABELS[w]}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Plages de dates */}
            <div className="col-span-2 flex items-center gap-2">
                <span className="text-[12px] text-neutral-400 shrink-0 w-4">Du</span>
                <Input
                    type="date"
                    value={values.dateFrom}
                    onChange={(e) => onChange("dateFrom", e.target.value)}
                    className="border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 text-[13px] flex-1"
                />
                <span className="text-[12px] text-neutral-400 shrink-0 w-4">au</span>
                <Input
                    type="date"
                    value={values.dateTo}
                    onChange={(e) => onChange("dateTo", e.target.value)}
                    className="border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 text-[13px] flex-1"
                />
            </div>
        </div>
    )
}
