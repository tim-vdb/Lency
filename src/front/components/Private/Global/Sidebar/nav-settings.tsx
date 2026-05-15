"use client"

import { Bell, ChevronRight, CreditCard, Settings2, Shield, User2 } from "lucide-react"
import Link from "next/link"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/front/components/ui/collapsible"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/front/components/ui/sidebar"

const settingsItems = [
  { title: "Compte", url: "/account/settings/profile", icon: User2 },
  { title: "Notifications", url: "/account/settings/notifs", icon: Bell },
  { title: "Sécurité", url: "/account/settings/security", icon: Shield },
  { title: "Facturation", url: "/account/settings/billing", icon: CreditCard },
]

export function NavSettings() {
  return (
    <SidebarMenu>
      <Collapsible asChild className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip="Paramètres">
              <Settings2 />
              <span className="items_sidebar">Paramètres</span>
              <ChevronRight className="ml-auto transition-[transform,opacity] duration-800 ease-in-out group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:opacity-0" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {settingsItems.map((item) => (
                <SidebarMenuSubItem key={item.title}>
                  <SidebarMenuSubButton asChild>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span className="items_sidebar">{item.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  )
}
