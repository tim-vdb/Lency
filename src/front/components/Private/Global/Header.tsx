"use client";

import { Calendar } from "lucide-react";
import { ModeToggle } from "../../DarkMode/ModeToggle";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../../ui/breadcrumb";
import { Separator } from "../../ui/separator";
import { SheetTrigger } from "../../ui/sheet";
import { NavUser } from "./Sidebar/nav-user";

export default function Header() {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center justify-between gap-2 px-4 w-full">
                <div className="flex items-center gap-2">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">
                                    Build Your Application
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="flex items-center gap-4">
                    <SheetTrigger className="cursor-pointer"><Calendar className="w-5 h-5" /></SheetTrigger>
                    <Separator orientation="vertical" className="data-[orientation=vertical]:h-6 border border-neutral-500" />
                    <ModeToggle />
                    <Separator orientation="vertical" className="data-[orientation=vertical]:h-6 border border-neutral-500" />
                    <NavUser />
                </div>
            </div>
        </header>
    );
}