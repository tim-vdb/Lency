import { Skeleton } from "@/front/components/ui/skeleton";

export default function PostDetailLoading() {
    return (
        <div className="flex flex-col gap-4 max-w-5xl mx-auto">
            <Skeleton className="h-4 w-32 rounded" />
            <div className="flex flex-col gap-2">
                <Skeleton className="h-7 w-3/4 rounded" />
            </div>
            <Skeleton className="h-[360px] w-full rounded-xl" />
            <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-4/5 rounded" />
                <Skeleton className="h-4 w-2/3 rounded" />
            </div>
        </div>
    );
}
