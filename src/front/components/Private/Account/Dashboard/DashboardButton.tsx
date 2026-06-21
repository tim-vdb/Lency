import { useUser } from "@/front/states/contexts/user.context"
import Link from "next/link";
import { cn } from "@/front/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/front/components/ui/tooltip";
import { Button } from "@/front/components/ui/button";
import DashboardIcon from "@/front/components/ui/dashboard-icon";

type Props = {
    isCollapsed?: boolean;
};

export default function DashboardButton({ isCollapsed }: Props) {
    const user = useUser()

    if (!user || user.role !== "ADMIN") return null

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button asChild size="icon" className={cn("cursor-pointer dark:hover:bg-neutral-300 w-full p-0 min-h-8 max-h-8", isCollapsed && "min-w-8 max-w-8")}>
                    <Link href="/account" className="flex items-center justify-start gap-2 pl-2">
                        <DashboardIcon className="w-4 h-4 min-w-4 min-h-4 fill-white dark:fill-black" />
                        <span className="items_sidebar">Tableau de bord</span>
                    </Link>
                </Button>
            </TooltipTrigger>
            {isCollapsed && (
                <TooltipContent side="right">Tableau de bord</TooltipContent>
            )}
        </Tooltip>
    );
}

