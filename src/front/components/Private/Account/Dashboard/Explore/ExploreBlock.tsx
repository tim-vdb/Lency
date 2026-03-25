"use client"

import { Button } from "@/front/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/front/components/ui/card";
import { cn } from "@/front/lib/utils";
import ExploreMarketPlace from "./ExploreMarketPlace";
import ExplorePhysicPlace from "./ExplorePhysicPlace";

export default function ExploreBlock({ className }: { className?: string }) {
    return (
        <Card className={cn("flex flex-col gap-2 h-full overflow-hidden", className)}>
            <CardHeader className="flex items-center justify-between gap-2 px-5 shrink-0">
                <CardTitle className="text-xl">Explorer</CardTitle>
                <Button variant="outline" size="sm" className="border bg-neutral-300 cursor-pointer text-xs">
                    View All
                </Button>
            </CardHeader>
            <CardContent className="flex justify-center gap-5 px-0 w-full flex-1 overflow-hidden">
                <Card className="border-none shadow-none text-neutral-400 py-0 w-full h-full">
                    <CardContent className="flex flex-col gap-10 px-0 h-full">
                        <ExploreMarketPlace />
                        <ExplorePhysicPlace />
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
}