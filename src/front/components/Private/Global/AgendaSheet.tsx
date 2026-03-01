"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "../../ui/button";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../../ui/sheet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";

export default function AgendaSheet() {
    const data = {
        agenda: {
            items: [
                {
                    title: "Meeting with team",
                    time: "10:00 AM",
                },
                {
                    title: "Project review",
                    time: "2:00 PM",
                },
                {
                    title: "Meeting with team",
                    time: "10:00 AM",
                },
                {
                    title: "Project review",
                    time: "2:00 PM",
                },
                {
                    title: "Meeting with team",
                    time: "10:00 AM",
                },
                {
                    title: "Project review",
                    time: "2:00 PM",
                },
                {
                    title: "Meeting with team",
                    time: "10:00 AM",
                },
                {
                    title: "Project review",
                    time: "2:00 PM",
                },
            ],
        },
    }

    return (
        <SheetContent>
            <SheetHeader className='mb-8 space-y-0'>
                <SheetTitle>Agenda</SheetTitle>
                <div className='flex items-center justify-between'>
                    <SheetDescription>Here is your agenda for today.</SheetDescription>
                    <Button variant="ghost" size="icon" className='flex items-center gap-2 w-fit p-2 pr-0 cursor-pointer'>
                        <span>Voir plus</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </SheetHeader>
            <div className='flex flex-col gap-8 mt-4 overflow-y-scroll h-[calc(100vh-12rem)]'>
                {data.agenda.items.map((item, index) => (
                    <div key={index} className='flex flex-col items-center justify-between px-4 py-2'>
                        <p className="text-sm text-muted-foreground text-left w-full">{item.time}</p>
                        <Card className='w-full border border-neutral-300'>
                            <CardHeader>
                                <CardTitle>{item.title}</CardTitle>
                                <CardDescription>This is a description of the agenda item.</CardDescription>
                            </CardHeader>
                            <CardContent>

                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
        </SheetContent>
    );
}