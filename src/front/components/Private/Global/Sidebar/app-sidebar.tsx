"use client"

import { ToggleDarkMode } from "@/front/components/DarkMode/ToggleDarkMode"
import { Separator } from "@/front/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar
} from "@/front/components/ui/sidebar"
import * as React from "react"
import AgendaSheet from "../AgendaSheet"
import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { TeamSwitcher } from "./team-switcher"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar } = useSidebar()


  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavProjects />
      </SidebarContent>
      <SidebarFooter>
        <AgendaSheet />


        <ToggleDarkMode />

        <Separator orientation="horizontal" className="data-[orientation=vertical]:h-6 border border-neutral-500" />

        <div onClick={toggleSidebar} className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-all bg-primary text-primary-foreground hover:bg-primary/90 gap-0 cursor-pointer">
          <SidebarTrigger onClick={(e) => { e.preventDefault() }} className="p-2 cursor-pointer hover:bg-transparent! hover:text-inherit" />
          <span className="items_sidebar">
            Réduire le menu
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
