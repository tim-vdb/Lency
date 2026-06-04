"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/front/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/front/components/ui/card";
import RecentlyViewed, { RecentlyViewedSkeleton } from "./RecentlyViewed";
import { useRecentlyViewed } from "@/front/stores/use-recently-viewed.store";
import { useEffect, useState } from "react";

export default function RecentlyViewedSidebar() {
    const entries = useRecentlyViewed((s) => s.entries);
    const clearViewed = useRecentlyViewed((s) => s.clear);
    const purgeInvalid = useRecentlyViewed((s) => s.purgeInvalid);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        purgeInvalid();
    }, []);

    return (
        <div className="sticky top-0.5 w-60 shrink-0 hidden lg:block">
            <Card className="shadow-none">
                <CardHeader className="flex flex-row items-center justify-between gap-2 px-3 py-3">
                    <CardTitle className="text-sm font-semibold">Récemment vu</CardTitle>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={clearViewed}
                        className="w-7 h-7 text-neutral-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 shrink-0"
                        title="Nettoyer"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                </CardHeader>
                <CardContent className="px-2 pb-2">
                    {!mounted
                        ? <RecentlyViewedSkeleton />
                        : <RecentlyViewed entries={entries} />
                    }
                </CardContent>
            </Card>
        </div>
    );
}
