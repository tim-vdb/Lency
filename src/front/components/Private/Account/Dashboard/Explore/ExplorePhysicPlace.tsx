import { Card } from "@/front/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/front/components/ui/tabs";
import { Clapperboard, LandPlot } from "lucide-react";

export default function ExplorePhysicPlace() {

    return (
        <Tabs defaultValue="spots" className="flex flex-col items-center gap-1 h-full">
            <div className="px-5 w-full">
                <TabsList className="shrink-0 grid w-full grid-cols-2 gap-4 p-0 px-2">
                    <TabsTrigger value="spots" className="flex items-center gap-2 cursor-pointer">
                        Spots
                        <Clapperboard className="w-5 h-5" />
                    </TabsTrigger>
                    <TabsTrigger value="events" className="flex items-center gap-2 cursor-pointer">
                        Évènements
                        <LandPlot className="w-5 h-5" />
                    </TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="spots" className="flex flex-col gap-4 w-full overflow-y-auto flex-1 px-5 pb-1">
                <Card className="border border-neutral-600 gap-1 text-neutral-400 py-0 w-full h-full">

                </Card>
            </TabsContent>
            <TabsContent value="events" className="flex flex-col gap-4 w-full overflow-y-auto flex-1 px-5 pb-1">
                <Card className="border border-neutral-600 gap-1 text-neutral-400 py-0 w-full h-full">

                </Card>
            </TabsContent>
        </Tabs>
    )
}
