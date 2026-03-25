"use client";

import { Button } from "@/front/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/front/components/ui/card";
import Image from "next/image";

// Tableaux de données
const events = [
    {
        id: 1,
        title: "Évènement 1",
        description: "Description du Évènement 1",
        date: new Date(),
        image: "/images/blog/img1.jpg"
    },
    {
        id: 2,
        title: "Évènement 2",
        description: "Description du Évènement 2",
        date: new Date(),

        image: "/images/team/avatar/Photo_Pro_avecOutline.png"
    },
    {
        id: 3,
        title: "Évènement 3",
        description: "Description du Évènement 3",
        date: new Date(),
        image: "/images/team/avatar/Photo_Pro_avecOutline.png"
    },
    {
        id: 4,
        title: "Évènement 4",
        description: "Description du Évènement 4",
        date: new Date(),
        image: "/images/team/avatar/Photo_Pro_avecOutline.png"
    },
    {
        id: 5,
        title: "Évènement 5",
        description: "Description du Évènement 5",
        date: new Date(),
        image: "/images/team/avatar/Photo_Pro_avecOutline.png"
    },
    {
        id: 6,
        title: "Évènement 6",
        description: "Description du Évènement 6",
        date: new Date(),
        image: "/images/team/avatar/Photo_Pro_avecOutline.png"
    },
    {
        id: 7,
        title: "Évènement 7",
        description: "Description du Évènement 7",
        date: new Date(),
        image: "/images/team/avatar/Photo_Pro_avecOutline.png"
    },
];

export default function EventsBlock() {
    return (
        <Card className="flex flex-col shadow-none pt-2 pb-0 w-full pr-0 gap-2 2xl:gap-4 overflow-hidden bg-transparent rounded-none">
            <CardHeader className="p-0">
                <div className="flex justify-between gap-1">
                    <div className='flex flex-col gap-2'>
                        <CardTitle className="2xl:text-xl">Les Challenges et Concours</CardTitle>
                        <CardDescription className="max-w-xs text-xs 2xl:text-base line-clamp-2">Reste à jour sur les prochains challenges et concours de la communauté</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="border bg-neutral-300 cursor-pointer text-xs">
                        View All
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex justify-center gap-5 px-0 w-full flex-1 overflow-hidden rounded-none">
                <Card className="border-none shadow-none gap-1 text-neutral-400 py-0 w-full h-full">
                    <CardContent className="flex flex-col overflow-y-auto gap-4 pl-1 pr-4">
                        {events.map((event) => (
                            <Card key={event.id} className="border border-neutral-400 p-3 shadow-lg-base">
                                <CardContent className="flex items-center justify-between gap-2 px-0  h-18 2xl:h-20">
                                    <div className="flex flex-col gap-2 h-full">
                                        <div className="flex flex-col items-start gap-2">
                                            <span className="text-[10px] text-neutral-500">{event.date.toLocaleDateString()}</span>
                                            <CardTitle>{event.title}</CardTitle>
                                        </div>
                                        <CardDescription className="text-xs 2xl:text-sm">{event.description}</CardDescription>
                                    </div>
                                    <Image width={100} height={100} src={event.image} alt={event.title} className="w-18 2xl:w-20 h-full 2xl:h-20 bg-contain rounded-md" />
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
}