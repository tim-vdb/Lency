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

const publicLinks: { title: string; url: string; icon: LucideIcon }[] = [
  { title: "Accueil", url: "/", icon: Home },
  { title: "À propos", url: "/about", icon: Info },
  { title: "Support", url: "/support", icon: MessagesSquare },
  { title: "Blog", url: "/blog", icon: NotebookText },
]

export function NavPublic() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Publiques</SidebarGroupLabel>
      <SidebarMenu>
        {publicLinks.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild tooltip={item.title}>
              <Link href={item.url}>
                <item.icon />
                <span className="items_sidebar">{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
