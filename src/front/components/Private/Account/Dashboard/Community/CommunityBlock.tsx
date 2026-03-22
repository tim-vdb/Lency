'use client';

import { ChevronRight, Plus } from "lucide-react";
import { Button } from "../../../../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../ui/card";
import EventsBlock from "../Events/EventsBlock";
import PostsBlock from "./PostsBlock";
import { Separator } from "@/front/components/ui/separator";

export default function CommunityBlock() {

    return (
        <Card className="justify-between col-span-5 gap-0 2xl:px-6 2xl:gap-10">
            <CardHeader className="flex items-center flex-col px-0">
                <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col">
                        <CardTitle className='flex flex-wrap text-2xl'>La Communauté</CardTitle>
                        <CardDescription>Partage ton court-métrage, ton sound design, ta voix off… et connecte-toi à des talents.</CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant={"outline"} className="ml-auto shadow-lg-base cursor-pointer border-neutral-300">
                            <span>New Post</span>
                            <Plus className="w-4 h-4" />
                        </Button>
                        <Button variant={"outline"} className="ml-auto shadow-lg-base cursor-pointer border-neutral-300">
                            <span>Let's Connect</span>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex justify-between gap-8 px-0 overflow-hidden h-72">
                <PostsBlock />
                <Separator orientation="vertical" className="bg-neutral-500 border-2 rounded-t-full" />
                <EventsBlock />
            </CardContent >
        </Card >
    );
}