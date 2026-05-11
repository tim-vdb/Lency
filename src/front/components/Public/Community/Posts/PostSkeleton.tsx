import { Card, CardContent } from "@/front/components/ui/card";
import { Skeleton } from "@/front/components/ui/skeleton";

export default function PostSkeleton() {
    return (
        <Card>
            <CardContent className="flex flex-col gap-4 p-5">
                {/* Avatar + name */}
                <div className="flex items-center gap-2.5">
                    <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                    <Skeleton className="h-3 w-32 rounded-md" />
                </div>

                {/* Text lines */}
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-3 w-full rounded-md" />
                    <Skeleton className="h-3 w-full rounded-md" />
                    <Skeleton className="h-3 w-2/3 rounded-md" />
                </div>

                {/* Actions bar */}
                <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-5 w-5 rounded-md" />
                        <Skeleton className="h-5 w-5 rounded-md" />
                        <Skeleton className="h-5 w-5 rounded-md" />
                        <Skeleton className="h-5 w-5 rounded-md" />
                    </div>
                    <Skeleton className="h-7 w-24 rounded-md" />
                </div>
            </CardContent>
        </Card>
    );
}
