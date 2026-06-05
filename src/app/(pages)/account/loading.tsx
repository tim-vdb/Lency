import { Skeleton } from "@/front/components/ui/skeleton";

export default function AccountLoading() {
    return (
        <div className="flex flex-col gap-6">
            <Skeleton className="h-8 w-48 rounded" />
            <div className="flex flex-col gap-3">
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
            </div>
        </div>
    );
}
