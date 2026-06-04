import { Skeleton } from "@/front/components/ui/skeleton";
import { ChevronRight } from "lucide-react";

export function ProjectSkeleton({ label }: { label: string }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-1">
                <span className="font-['Poppins',sans-serif] font-bold text-[20px] text-black">{label}</span>
                <ChevronRight className="w-5 h-5 text-neutral-300" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-[10px] overflow-hidden flex flex-col">
                        <Skeleton className="w-full h-[175px]" />
                        <div className="p-5 flex flex-col gap-3">
                            <Skeleton className="h-5 w-3/4 rounded" />
                            <Skeleton className="h-3 w-full rounded" />
                            <Skeleton className="h-3 w-2/3 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function TalentSkeleton({ label }: { label: string }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-1">
                <span className="font-['Poppins',sans-serif] font-bold text-[20px] text-black">{label}</span>
                <ChevronRight className="w-5 h-5 text-neutral-300" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-[10px] p-5 flex flex-col gap-3">
                        <div className="flex items-start gap-4">
                            <Skeleton className="w-[70px] h-[70px] rounded-full shrink-0" />
                            <div className="flex flex-col gap-2 flex-1">
                                <Skeleton className="h-5 w-2/3 rounded" />
                                <div className="flex gap-1.5">
                                    <Skeleton className="h-[26px] w-24 rounded-[5px]" />
                                    <Skeleton className="h-[26px] w-20 rounded-[5px]" />
                                </div>
                            </div>
                        </div>
                        <Skeleton className="h-3 w-full rounded" />
                        <Skeleton className="h-3 w-4/5 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
}
