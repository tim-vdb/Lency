"use client";

import { Button } from "@/front/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/front/components/ui/card";
import { cn } from "@/front/lib/utils";
import Image from "next/image";

// Tableaux de données
const events = [
    {
        id: 1,
        title: "Évènement 1",
        description: "Description du Évènement 1",
        date: new Date(),
        image: "/images/team/avatar/Photo_Pro_avecOutline.png"
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

export default function EventsBlock({ className }: { className?: string }) {
    return (
        <Card className={cn("flex flex-col gap-2 h-full border border-neutral-400 overflow-hidden", className)}>
            <CardHeader className="flex items-center justify-between gap-2 px-5 shrink-0">
                <CardTitle>Les Évènements</CardTitle>
                <Button variant="outline" size="sm" className="border bg-neutral-300 cursor-pointer text-xs">
                    View All
                </Button>
            </CardHeader>
            <CardContent className="flex justify-center gap-5 px-0 w-full flex-1 overflow-hidden">
                <Card className="border-none shadow-none gap-1 text-neutral-400 py-0 w-full h-full">
                    <CardContent className="flex flex-col gap-4 px-5 h-full overflow-y-scroll">
                        {events.map((event) => (
                            <Card key={event.id} className="border border-neutral-400 py-4 shadow-md-base">
                                <CardContent className="flex items-center justify-between gap-2 px-3">
                                    <div className="flex flex-col gap-0.5">
                                        <div className="flex items-start gap-2">
                                            <span className="text-xs mb-2 text-neutral-500">{event.date.toLocaleDateString()}</span>
                                        </div>
                                        <div>
                                            <CardTitle>{event.title}</CardTitle>
                                            <CardDescription>{event.description}</CardDescription>
                                        </div>
                                    </div>
                                    <Image width={50} height={50} src={event.image} alt={event.title} />
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
}