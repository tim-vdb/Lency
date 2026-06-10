"use client"

import { useState, useMemo } from "react"
import { Button } from "@/front/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/front/components/ui/card";
import { cn } from "@/front/lib/utils";
import { useProjects } from "@/front/queries/projects"
import ExploreMarketPlace from "./ExploreMarketPlace";
import MapFilters, { type MapFiltersValues } from "./MapFilters"

import { Maximize2, X } from "lucide-react"

export default function ExploreBlock({ className }: { className?: string }) {
    const { data: projects = [] } = useProjects()
    const [filterValues, setFilterValues] = useState<MapFiltersValues>({
        title: "",
        projectType: "AUTRE",
        level: "DEBUTANT",
        remuneration: "NON_REMUNERE",
        workMode: "PRESENTIEL",
        dateFrom: "",
        dateTo: "",
    })
    const [isMapExpanded, setIsMapExpanded] = useState(false)

    // Suggestions pour le titre
    const titleSuggestions = useMemo(() => {
        if (!filterValues.title || filterValues.title.length === 0) return []
        return projects
            .filter(p => p.title.toLowerCase().includes(filterValues.title.toLowerCase()))
            .slice(0, 5)
            .map(p => ({ id: p.id, title: p.title }))
    }, [filterValues.title, projects])

    // Filtrer les projets selon les critères
    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            // Filtre par titre
            if (filterValues.title && !project.title.toLowerCase().includes(filterValues.title.toLowerCase())) {
                return false
            }
            // Filtre par type de projet (si "AUTRE" est sélectionné, afficher tous les projets)
            if (filterValues.projectType !== "AUTRE" && project.projectType !== filterValues.projectType) {
                return false
            }
            return true
        })
    }, [projects, filterValues.title, filterValues.projectType])

    const handleFilterChange = <K extends keyof MapFiltersValues>(key: K, value: MapFiltersValues[K]) => {
        setFilterValues(prev => ({ ...prev, [key]: value }))
    }

    return (
        <>
            {/* Modale fullscreen */}
            {isMapExpanded && (
                <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-50 bg-black flex flex-col">
                    {/* Header modale */}
                    <div className="flex items-center justify-between p-4 border-b border-neutral-700 shrink-0">
                        <h2 className="text-xl font-semibold text-white">Explorez la carte</h2>
                        <Button
                            onClick={() => setIsMapExpanded(false)}
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-neutral-800"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Contenu modale */}
                    <div className="flex flex-1 overflow-hidden gap-4 p-4">
                        {/* Carte à gauche - prend la majorité de l'espace */}
                        <div className="flex-1 rounded-lg overflow-hidden border border-neutral-700">
                            <Card className="border-none shadow-none text-neutral-400 py-0 h-full">
                                <CardContent className="px-0 h-full">
                                    <ExploreMarketPlace
                                        filteredProjects={filteredProjects}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Filtres à droite */}
                        <div className="w-80 bg-neutral-900 rounded-lg p-6 border border-neutral-700 overflow-y-auto shrink-0">
                            <h3 className="text-lg font-semibold text-white mb-4">Filtres</h3>
                            <MapFilters
                                values={filterValues}
                                onChange={handleFilterChange}
                                titleSuggestions={titleSuggestions}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Vue normale (pas de modale) */}
            {!isMapExpanded && (
                <Card className={cn("flex flex-col gap-5 h-full overflow-hidden", className)}>
                    <CardHeader className="flex items-center justify-between gap-2 px-5 shrink-0">
                        <CardTitle className="text-xl">Explorer</CardTitle>
                        <div className="flex items-center gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setIsMapExpanded(true)}
                                className="border bg-neutral-300 cursor-pointer text-xs"
                                title="Agrandir la carte"
                            >
                                <Maximize2 className="w-4 h-4 mr-1" />
                                Agrandir
                            </Button>
                            <Button variant="outline" size="sm" className="border bg-neutral-300 cursor-pointer text-xs">
                                View All
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6 px-0 w-full flex-1 overflow-hidden pb-5">
                        {/* Carte */}
                        <Card className="border-none shadow-none text-neutral-400 py-0 w-full h-1/2 overflow-hidden px-5">
                            <CardContent className="flex flex-col gap-10 px-0 h-full">
                                <ExploreMarketPlace
                                    filteredProjects={filteredProjects}
                                />
                            </CardContent>
                        </Card>

                        {/* Filtres */}
                        <div className="px-5">
                            <MapFilters
                                values={filterValues}
                                onChange={handleFilterChange}
                                titleSuggestions={titleSuggestions}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    );
}