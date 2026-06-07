import { useUser } from "@/front/states/contexts/user.context"
import { Button } from "../../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import Link from "next/link";
import { Shield } from "lucide-react";
import { cn } from "@/front/lib/utils";

type Props = {
    isCollapsed?: boolean;
};

export default function AdminButton({ isCollapsed }: Props) {
    const user = useUser()

    if (!user || user.role !== "ADMIN") return null

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button asChild size="icon" className={cn("cursor-pointer dark:hover:bg-neutral-300 w-full p-0 min-h-8 max-h-8", isCollapsed && "min-w-8 max-w-8")}>
                    <Link href="/admin" className="flex items-center justify-start gap-2 pl-2">
                        <Shield className="w-4 h-4 min-w-4 min-h-4" />
                        <span className="items_sidebar">Administration</span>
                    </Link>
                </Button>
            </TooltipTrigger>
            {isCollapsed && (
                <TooltipContent side="right">Administration</TooltipContent>
            )}
        </Tooltip>
    );
}