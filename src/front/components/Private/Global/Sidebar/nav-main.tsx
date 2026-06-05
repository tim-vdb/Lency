"use client"

import DashboardIcon from "@/front/components/ui/dashboard-icon"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/front/components/ui/collapsible"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/front/components/ui/popover"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/front/components/ui/sidebar"
import { Briefcase, ChevronRight, Store, Users, Rss, BookOpen, Bookmark, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import React from "react"

type NavSubItem = {
  title: string
  url: string
  icon?: LucideIcon
}

type NavMainItem = {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  items: NavSubItem[]
}

const navMain: NavMainItem[] = [
  {
    title: "Communauté",
    url: "/community",
    icon: Users,
    items: [
      { title: "Fil d'actualité", url: "/community", icon: Rss },
      { title: "Ressources", url: "/community/resources", icon: BookOpen },
      { title: "Enregistrés", url: "/community/saved", icon: Bookmark },
    ],
  },
  {
    title: "Marketplace",
    url: "/marketplace",
    icon: Store,
    items: [
      { title: "Projets", url: "/marketplace", icon: Briefcase },
      { title: "Talents", url: "/marketplace?tab=talents", icon: Users },
    ],
  }
]

export function NavMain() {
  const { state } = useSidebar()
  const pathname = usePathname()
  const router = useRouter()
  const [openPopoverId, setOpenPopoverId] = React.useState<string | null>(null)
  const [openCollapsibleId, setOpenCollapsibleId] = React.useState<string | null>(null)
  const [isHydrated, setIsHydrated] = React.useState(false)

  const isCollapsed = state === "collapsed"

  // Close popover when pathname changes

  // Initialize state from sessionStorage and set default
  React.useEffect(() => {
    try {
      const savedOpenId = sessionStorage.getItem("sidebar_open_collapsible")
      if (savedOpenId) {
        setOpenCollapsibleId(savedOpenId)
      } else {
        // Set default to active item
        const activeItem = navMain.find((item) => item.isActive)
        if (activeItem) {
          setOpenCollapsibleId(activeItem.title)
        }
      }
    } catch (_e) {
      // Fallback if sessionStorage is not available
      const activeItem = navMain.find((item) => item.isActive)
      if (activeItem) {
        setOpenCollapsibleId(activeItem.title)
      }
    }
    setIsHydrated(true)
  }, [])

  const handleCollapsibleChange = (itemTitle: string, open: boolean) => {
    if (open) {
      setOpenCollapsibleId(itemTitle)
      try {
        sessionStorage.setItem("sidebar_open_collapsible", itemTitle)
      } catch (_e) {
        // Ignore if sessionStorage is not available
      }
    } else if (openCollapsibleId === itemTitle) {
      setOpenCollapsibleId(null)
      try {
        sessionStorage.removeItem("sidebar_open_collapsible")
      } catch (_e) {
        // Ignore if sessionStorage is not available
      }
    }
  }

  const handleMenuButtonClick = (e: React.MouseEvent, itemTitle: string) => {
    if (isCollapsed) {
      e.preventDefault()
      e.stopPropagation()
      setOpenPopoverId(openPopoverId === itemTitle ? null : itemTitle)
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Fonctionnalités</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuButton asChild tooltip="Dashboard">
          <Link href="/account">
            <DashboardIcon />
            <span className="items_sidebar">Dashboard</span>
          </Link>
        </SidebarMenuButton>
        {isHydrated && navMain.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            open={openCollapsibleId === item.title}
            onOpenChange={(open) => handleCollapsibleChange(item.title, open)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <Popover
                open={isCollapsed && openPopoverId === item.title}
                onOpenChange={(open) => {
                  if (!open) {
                    setOpenPopoverId(null)
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      onClick={(e) => handleMenuButtonClick(e, item.title)}
                    >
                      {item.icon && <item.icon />}
                      <span className="items_sidebar">
                        {item.title}
                      </span>
                      <ChevronRight className="ml-auto transition-[transform,opacity] duration-800 ease-in-out group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:opacity-0" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </PopoverTrigger>
                {isCollapsed && item.items && item.items.length > 0 && (
                  <PopoverContent
                    side="right"
                    align="start"
                    className="w-56 p-2"
                    onClick={() => setOpenPopoverId(null)}
                  >
                    <div className="flex flex-col gap-1">
                      {item.items.map((subItem) => {
                        const isCurrentPage = pathname === item.url
                        const sharedClass = "flex h-8 items-center gap-2 rounded-md px-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors cursor-pointer w-full text-left"
                        return isCurrentPage ? (
                          <button
                            key={subItem.title}
                            onClick={() => router.replace(subItem.url, { scroll: false })}
                            className={sharedClass}
                          >
                            {subItem.icon && <subItem.icon className="size-4 shrink-0" />}
                            <span>{subItem.title}</span>
                          </button>
                        ) : (
                          <Link
                            key={subItem.title}
                            href={subItem.url}
                            className={sharedClass}
                          >
                            {subItem.icon && <subItem.icon className="size-4 shrink-0" />}
                            <span>{subItem.title}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </PopoverContent>
                )}
              </Popover>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => {
                    const isCurrentPage = pathname === item.url
                    return (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild={!isCurrentPage}>
                          {isCurrentPage ? (
                            <button
                              onClick={() => router.replace(subItem.url, { scroll: false })}
                              className="flex w-full items-center gap-2 cursor-pointer"
                            >
                              {subItem.icon && <subItem.icon className="size-4" />}
                              <span className="items_sidebar">{subItem.title}</span>
                            </button>
                          ) : (
                            <Link href={subItem.url}>
                              {subItem.icon && <subItem.icon className="size-4" />}
                              <span className="items_sidebar">{subItem.title}</span>
                            </Link>
                          )}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
