import { Card, CardContent, CardFooter } from "@/front/components/ui/card";
import { Skeleton } from "@/front/components/ui/skeleton";

export default function PostSkeleton() {
    return (
        <Card className="w-full min-w-3xl">
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

export function PostImageSkeleton() {
    return (
        <Card className="w-full min-w-3xl p-6 sm:p-12">
            <CardContent className="flex flex-col gap-4 px-0">
                {/* Avatar + menu */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                        <Skeleton className="h-3 w-32 rounded-md" />
                    </div>
                    <Skeleton className="h-6 w-6 rounded-md" />
                </div>

                {/* Image */}
                <Skeleton className="w-full h-[420px] rounded-xl" />
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4 px-0 pt-4">
                {/* Actions */}
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-5 w-5 rounded-md" />
                        <Skeleton className="h-5 w-5 rounded-md" />
                        <Skeleton className="h-5 w-5 rounded-md" />
                        <Skeleton className="h-5 w-5 rounded-md" />
                    </div>
                    <Skeleton className="h-7 w-24 rounded-md" />
                </div>
                {/* Text lines */}
                <div className="flex flex-col gap-2 w-full">
                    <Skeleton className="h-3 w-3/4 rounded-md" />
                    <Skeleton className="h-3 w-1/2 rounded-md" />
                </div>
            </CardFooter>
        </Card>
    );
}
