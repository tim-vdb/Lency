"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/front/components/ui/sidebar"
import { Home, Info, MessagesSquare, NotebookText, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const publicLinks: { title: string; url: string; icon: LucideIcon }[] = [
  { title: "Accueil", url: "/", icon: Home },
  { title: "À propos", url: "/about", icon: Info },
  { title: "Support", url: "/support", icon: MessagesSquare },
  { title: "Blog", url: "/blog", icon: NotebookText },
]

export function NavPublic() {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Publiques</SidebarGroupLabel>
      <SidebarMenu>
        {publicLinks.map((item) => {
          const isActive = pathname === item.url || (item.url !== "/" && pathname.startsWith(item.url))
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title} className={isActive ? "bg-orange dark:bg-black text-white [&>svg]:text-white [&_svg]:text-white" : ""}>
                <Link href={item.url}>
                  <item.icon />
                  <span className="items_sidebar">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
