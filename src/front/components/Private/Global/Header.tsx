"use client";

import { Bell, Plus } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../../ui/breadcrumb";
import { Separator } from "../../ui/separator";
import { SheetTrigger } from "../../ui/sheet";
import { NavUser } from "./Sidebar/nav-user";
import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { cn } from "@/front/lib/utils";
import { useSidebar } from "../../ui/sidebar";
import { usePathname } from "next/navigation";

export default function Header({ className }: { className?: string }) {
    const [isNotifs,] = useState(true)
    const [isScrolled, setIsScrolled] = useState(false)
    const { state } = useSidebar()
    const pathname = usePathname()

    const isFixedLayout = pathname !== "/account" && pathname !== "/admin"

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
            "flex h-14 shrink-0 items-center gap-2 border dark:border-white backdrop-blur-xs backdrop-brightness-100 bg-white/40 dark:backdrop-blur-xs dark:backdrop-brightness-60 dark:bg-black/40 rounded-xl transition-[width,height,left,border-radius,background-color] duration-800 ease-in-out group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 mr-1.5",
            isScrolled && "rounded-r-none bg-white",
            isFixedLayout && "fixed top-2 z-40",
            isFixedLayout && state === "expanded"
                ? "left-[calc(14.3rem)] right-2"
                : isFixedLayout && "left-16.5 right-2",
            className
        )}>
            <div className="flex items-center justify-between gap-2 px-4 w-full">
                <Breadcrumb className="flex items-center gap-2">
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="#" className="text-black dark:text-white">
                                Build Your Application
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block text-black dark:text-white" />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-black dark:text-white">Data Fetching</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="flex items-center gap-4">
                    <Button variant={"outline"} className="ml-auto shadow-lg-base cursor-pointer border-neutral-300 animate-spin">
                        <span>Créer</span>
                        <Plus className="w-4 h-4" />
                    </Button>
                    <SheetTrigger className="cursor-pointer relative flex">
                        <Bell className="w-6 h-6 fill-black text-black dark:fill-white dark:text-white" />
                        {isNotifs &&
                            (<span className="flex w-4 h-4">
                                <span className="absolute inline-flex -top-1 left-3 h-4 w-4 rounded-full bg-red-500 opacity-75 "></span>
                                <span className="relative inline-flex justify-center items-center -top-1 -left-3 h-4 w-4 rounded-full text-xs text-white bg-red-600">2</span>
                            </span>)
                        }
                    </SheetTrigger>
                    <Separator orientation="vertical" className="data-[orientation=vertical]:h-6 border border-neutral-500" />
                    <NavUser />
                </div>
            </div>
        </header>
    );
}