import { Button } from "@/front/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/front/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/front/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Clapperboard, LandPlot } from "lucide-react";
import Image from "next/image";

// Tableaux de données
const projects = [
    {
        id: 1,
        title: "Projet 1",
        description: "Description du projet 1",
        date: new Date(),
        isActive: true,
        image: "/images/team/avatar/Photo_Pro_avecOutline.png"
    },
    {
        id: 2,
        title: "Projet 2",
        description: "Description du projet 2",
        date: new Date(),
        isActive: false,
        image: "/images/team/avatar/Photo_Pro_avecOutline.png"
    },
    {
        id: 3,
        title: "Projet 3",
        description: "Description du projet 3",
        date: new Date(),
        isActive: true,
        image: "/images/team/avatar/Photo_Pro_avecOutline.png"
    },
    {
        id: 4,
        title: "Projet 4",
        description: "Description du projet 4",
        date: new Date(),
        isActive: true,
        image: "/images/team/avatar/Photo_Pro_avecOutline.png"
    },
    {
        id: 5,
        title: "Projet 5",
        description: "Description du projet 5",
        date: new Date(),
        isActive: true,
        image: "/images/team/avatar/Photo_Pro_avecOutline.png"
    },
    {
        id: 6,
        title: "Projet 6",
        description: "Description du projet 6",
        date: new Date(),
        isActive: true,
        image: "/images/team/avatar/Photo_Pro_avecOutline.png"
    },
    {
        id: 7,
        title: "Projet 7",
        description: "Description du projet 7",
        date: new Date(),
        isActive: true,
        image: "/images/team/avatar/Photo_Pro_avecOutline.png"
    },
];

const spots = [
    {
        id: 1,
        title: "Spot 1",
        description: "Description du spot 1",
        date: new Date(),
        isActive: true,
        image: "/images/team/avatar/Photo_Pro_avecOutline.png"
    },
    {
        id: 2,
        title: "Spot 2",
        description: "Description du spot 2",
        date: new Date(),
        isActive: false,
        image: "/images/team/avatar/Photo_Pro_avecOutline.png"
    },
    {
        id: 3,
        title: "Spot 3",
        description: "Description du spot 3",
        date: new Date(),
        isActive: true,
        image: "/images/team/avatar/Photo_Pro_avecOutline.png"
    }
];

export default function ExploreBlock() {
    return (
        <Card className="flex flex-col h-full shadow-lg-inset col-[5/7] row-[5/9] overflow-hidden">
            <CardHeader className="flex items-center justify-between gap-2 px-4 shrink-0">
                <CardTitle>Explore</CardTitle>
                <Button variant="outline" size="sm" className="border bg-neutral-300 cursor-pointer text-xs">
                    View All
                </Button>
            </CardHeader>
            <CardContent className="flex justify-center gap-5 px-4 w-full flex-1 overflow-hidden">
                <Card className="border-none shadow-none gap-1 text-neutral-400 py-0 w-full h-full">
                    <CardContent className="flex flex-col gap-4 px-0 h-full">
                        <Tabs defaultValue="projects" className="flex flex-col items-center gap-4 h-full">
                            <TabsList className="p-2 h-10 shrink-0">
                                <TabsTrigger value="projects" className="flex items-center gap-2 cursor-pointer ">
                                    Projets
                                    <Clapperboard className="w-5 h-5" />
                                </TabsTrigger>
                                <TabsTrigger value="spots" className="flex items-center gap-2 cursor-pointer">
                                    Spots
                                    <LandPlot className="w-5 h-5" />
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="projects" className="flex flex-col gap-4 w-full overflow-y-auto flex-1 pr-2 pb-1">
                                {projects.map((project) => (
                                    <Card key={project.id} className="border border-neutral-300 py-4 shadow-md-base">
                                        <CardContent className="flex items-center justify-between gap-2 px-3">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-start gap-2">
                                                    <span className="text-xs mb-2 text-neutral-500">{project.date.toLocaleDateString()}</span>
                                                    {project.isActive && (
                                                        <span title="Un projet est actif si un des membres s'est connecté depuis une semaine" className="text-xs bg-blue-100 text-blue-800 px-2 rounded-full cursor-help">Projet actif</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <CardTitle>{project.title}</CardTitle>
                                                    <CardDescription>{project.description}</CardDescription>
                                                </div>
                                            </div>
                                            <Image width={50} height={50} src={project.image} alt={project.title} />
                                        </CardContent>
                                    </Card>
                                ))}
                            </TabsContent>
                            <TabsContent value="spots" className="flex flex-col gap-4 w-full overflow-y-auto flex-1 pr-2 pb-1">
                                {spots.map((spot) => (
                                    <Card key={spot.id} className="border border-neutral-300 py-4 ">
                                        <CardContent className="flex items-center justify-between gap-2 px-3">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-start gap-2">
                                                    <span className="text-xs mb-2 text-neutral-500">{spot.date.toLocaleDateString()}</span>
                                                    {spot.isActive && (
                                                        <span title="Un spot est actif s'il a été visité récemment" className="text-xs bg-green-100 text-green-800 px-2 rounded-full cursor-help">Spot actif</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <CardTitle>{spot.title}</CardTitle>
                                                    <CardDescription>{spot.description}</CardDescription>
                                                </div>
                                            </div>
                                            <Image width={50} height={50} src={spot.image} alt={spot.title} />
                                        </CardContent>
                                    </Card>
                                ))}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
}