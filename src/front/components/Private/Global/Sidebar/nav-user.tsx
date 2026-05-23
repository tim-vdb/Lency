"use client"

import { useUser } from "@/front/context/UserContext"
import {
  BadgeCheck,
  Bell,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  LogOutIcon,
  MessageSquare,
  Settings,
  Shield,
  User2,
  UserRound
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/front/components/ui/avatar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/front/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/front/components/ui/dropdown-menu"
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "@/front/components/ui/sidebar"
import LogOut from "../../Auth/LogOut"
import FeedbackDialog from "@/front/components/common/FeedbackDialog"

const settingsItems = [
  { title: "Compte", url: "/account/settings/profile", icon: User2 },
  { title: "Notifications", url: "/account/settings/notifs", icon: Bell },
  { title: "Sécurité", url: "/account/settings/security", icon: Shield },
  { title: "Facturation", url: "/account/settings/billing", icon: CreditCard },
]

export function NavUser() {
  const user = useUser()
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??"

  return (
    <>
      {user ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm outline-none hover:bg-neutral-150 hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? ""} />
                  <AvatarFallback className="rounded-full text-xs bg-black dark:bg-white text-white dark:text-black">{initials}</AvatarFallback>
                </Avatar>
                <ChevronsUpDown className="ml-1 size-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="min-w-56 rounded-lg"
              side="bottom"
              align="end"
              sideOffset={8}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? ""} />
                    <AvatarFallback className="rounded-full text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name ?? "Utilisateur"}</span>
                    <span className="truncate text-xs text-muted-foreground">{user?.email ?? ""}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href={`/user/${user.username ?? user.firstname}`}>
                    <UserRound className="size-4" />
                    Mon profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/account/badges">
                    <BadgeCheck className="size-4" />
                    Badges
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuGroup>
                  <DropdownMenuItem onSelect={() => setFeedbackOpen(true)} className="cursor-pointer">
                    <MessageSquare className="size-4" />
                    Feedback
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <Collapsible asChild className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip="Paramètres">
                        <Settings className="w-4 h-4" />
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
              </DropdownMenuGroup>
              {user?.role === "ADMIN" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/admin">
                        <Shield className="size-4" />
                        Administration
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOutIcon />
                <LogOut />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
        </>
      ) : (
        <Link href="/login">
          <User2 className="w-7 h-7" />
        </Link>
      )
      }
    </>
  )
}
