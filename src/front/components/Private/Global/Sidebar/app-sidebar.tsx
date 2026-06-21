"use client"

import { ToggleDarkMode } from "@/front/components/DarkMode/ToggleDarkMode"
import { Separator } from "@/front/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/front/components/ui/tooltip"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar
} from "@/front/components/ui/sidebar"
import Link from "next/link"
import * as React from "react"
import NotificationsSheet from "@/front/components/Private/Notifications/NotificationsSheet"
import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavPublic } from "./nav-public"
import { cn } from "@/front/lib/utils"
import LencyLogo from "@/front/components/ui/lency-logo"
import LencyIcon from "@/front/components/ui/lency-icon"
import AdminButton from "../../Admin/AdminButton"
import { NavAdmin } from "./nav-admin"
import { usePathname } from "next/navigation"
import DashboardButton from "../../Account/Dashboard/DashboardButton"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, toggleSidebar } = useSidebar()
  const isCollapsed = state === "collapsed"

  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")


  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader className="flex items-center justify-center pt-5 pb-10">
        <Link href="/" className="relative flex items-center justify-center h-8 w-full">
          <div className={cn("absolute transition-all ease-in fill-mode-forwards", isCollapsed ? "opacity-0 scale-90 pointer-events-none duration-0" : "opacity-100 scale-100 duration-800")}>
            <LencyLogo />
          </div>
          <div className={cn(isCollapsed ? "opacity-100" : "opacity-0")}>
            <LencyIcon />
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2 py-2">
        {!isAdmin && (
          <>
            <NavMain />
            <NavProjects />
          </>
        )}

        {isAdmin && (
          <NavAdmin />
        )}

        <NavPublic />
      </SidebarContent>
      <SidebarFooter>
        <NotificationsSheet />

        {isAdmin && (
          <DashboardButton isCollapsed={isCollapsed} />
        )}

        {!isAdmin && (
          <AdminButton isCollapsed={isCollapsed} />
        )}

        <ToggleDarkMode isCollapsed={isCollapsed} />

        <Separator orientation="horizontal" className="data-[orientation=vertical]:h-6 border border-neutral-500" />

        <Tooltip>
          <TooltipTrigger asChild>
            <div onClick={toggleSidebar} className="inline-flex items-center justify-start whitespace-nowrap dark:text-white rounded-md font-medium transition-all text-primary-foreground bg-orange hover:bg-orange/80 gap-0 cursor-pointer">
              <SidebarTrigger onClick={(e) => { e.preventDefault() }} className="p-2 cursor-pointer hover:text-inherit hover:bg-transparent min-w-8 min-h-8" />
              <span className="items_sidebar">
                Réduire le menu
              </span>
            </div>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right">Ouvrir le menu</TooltipContent>
          )}
        </Tooltip>
      </SidebarFooter>
    </Sidebar>
  )
}
