"use client"

import { ProjectsMap } from "@/front/components/Private/Account/Dashboard/map/ProjectsMap"
import { Card } from "@/front/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/front/components/ui/tabs"
import { Clapperboard, LandPlot } from "lucide-react"
import type { Project } from "@/front/lib/api/projects"


interface ExploreMarketPlaceProps {
    filteredProjects: Project[]
    addressCoords?: { lat: number; lon: number } | null
}

export default function ExploreMarketPlace({ filteredProjects }: ExploreMarketPlaceProps) {
    return (
        <Tabs defaultValue="projects" className="flex flex-col items-center gap-1 h-full">
            <div className="px-5 w-full">
                <TabsList className="shrink-0 grid w-full grid-cols-2 gap-4 p-0 px-2">
                    <TabsTrigger value="projects" className="flex items-center gap-2 cursor-pointer">
                        Projets
                        <Clapperboard className="w-5 h-5" />
                    </TabsTrigger>
                    <TabsTrigger value="members" className="flex items-center gap-2 cursor-pointer">
                        Membres
                        <LandPlot className="w-5 h-5" />
                    </TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="projects" className="flex flex-col gap-4 w-full overflow-hidden flex-1 px-5 pb-1">
                <Card className="border border-neutral-600 gap-1 text-neutral-400 py-0 w-full h-full overflow-hidden">
                    <ProjectsMap projects={filteredProjects} />
                </Card>
            </TabsContent>
            <TabsContent value="members" className="flex flex-col gap-4 w-full overflow-y-auto flex-1 px-5 pb-1">
                <Card className="border border-neutral-600 gap-1 text-neutral-400 py-0 w-full h-full">
                </Card>
            </TabsContent>
        </Tabs>
    )
}
