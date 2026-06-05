import { Skeleton } from "@/front/components/ui/skeleton";

export default function UserProfileLoading() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Skeleton className="w-20 h-20 rounded-full shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                    <Skeleton className="h-6 w-48 rounded" />
                    <Skeleton className="h-4 w-32 rounded" />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-4/5 rounded" />
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-20 rounded-full" />
            </div>
        </div>
    );
}
