"use client";

"use client";

import { Bell } from "lucide-react";
import { Separator } from "../../ui/separator";
import { SheetTrigger } from "../../ui/sheet";
import { NavUser } from "./Sidebar/nav-user";
import { useState, useEffect } from "react";
import { cn } from "@/front/lib/utils";
import { useSidebar } from "../../ui/sidebar";
import { usePathname } from "next/navigation";
import { CreateDropdown } from "./CreateDropdown";
import BreadcrumbAuto from "./BreadcrumbAuto";
import SearchBar from "../../SearchBar/SearchBar";
import { useNotificationsQuery } from "@/front/queries/notifications";

export default function Header({ className }: { className?: string }) {
    const [isScrolled, setIsScrolled] = useState(false)
    const { state } = useSidebar()
    const pathname = usePathname()

    const { data: notifications = [] } = useNotificationsQuery();
    const unreadCount = notifications.filter((n) => !n.read).length;

    const isFixedLayout = pathname !== "/account" && pathname !== "/admin"
    const isDashboard = pathname === "/account" || pathname === "/admin"


    useEffect(() => {
        const handleScroll = () => {
            const scrollElement = document.querySelector('main')
            if (scrollElement) {
                setIsScrolled(scrollElement.scrollTop > 0)
            }
        }

        const scrollElement = document.querySelector('main')
        scrollElement?.addEventListener('scroll', handleScroll)
        return () => scrollElement?.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className={cn(
            "flex h-14 shrink-0 mr-1 items-center gap-2 border dark:border-zinc-700 backdrop-blur-xs backdrop-brightness-100 bg-white/40 dark:backdrop-blur-xs dark:backdrop-brightness-60 dark:bg-card/60 rounded-xl transition-[width,height,left,border-radius,background-color] duration-800 ease-in-out group-has-data-[collapsible=icon]/sidebar-wrapper:h-14",
            isDashboard && "mr-2",
            isScrolled && "rounded-t-none",
            isFixedLayout && "md:fixed top-2 z-40",
            isFixedLayout && state === "expanded"
                ? "md:left-[14.3rem] md:right-2"
                : isFixedLayout && "md:left-16.5 md:right-2",
            className
        )}>
            <div className="flex items-center justify-between gap-2 px-4 w-full">
                <BreadcrumbAuto />
                <div className="flex items-center gap-2">
                    <SearchBar />
                    <CreateDropdown />
                    <Separator orientation="vertical" className="data-[orientation=vertical]:h-6 border border-neutral-500 mx-2" />
                    <SheetTrigger className="cursor-pointer relative flex">
                        <Bell className="w-6 h-6 min-w-6 min-h-6 fill-white text-black dark:fill-black/20 dark:text-white" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 left-3 flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange opacity-75" />
                                <span className="relative inline-flex h-4 w-4 rounded-full bg-red-600 text-white text-xs justify-center items-center">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            </span>
                        )}
                    </SheetTrigger>
                    <Separator orientation="vertical" className="data-[orientation=vertical]:h-6 border border-neutral-500 mx-2" />
                    <NavUser />
                </div>
            </div>
        </header>
    );
}