import { Skeleton } from "@/front/components/ui/skeleton";

export default function ProjectDetailLoading() {
    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            <Skeleton className="h-[280px] w-full rounded-xl" />
            <div className="flex flex-col gap-3">
                <Skeleton className="h-8 w-2/3 rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-4/5 rounded" />
                <Skeleton className="h-4 w-3/5 rounded" />
            </div>
            <div className="flex gap-3">
                <Skeleton className="h-9 w-32 rounded" />
                <Skeleton className="h-9 w-24 rounded" />
            </div>
        </div>
    );
}
