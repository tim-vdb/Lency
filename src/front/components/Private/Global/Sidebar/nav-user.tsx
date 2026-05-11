"use client"

import { useUser } from "@/front/context/UserContext"
import {
  ChevronsUpDown,
  House,
  LayoutTemplate,
  Shield,
  Star,
  User2,
  UserRound,
} from "lucide-react"
import Link from "next/link"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/front/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/front/components/ui/dropdown-menu"
import LogOut from "../../Auth/LogOut"
import { usePathname } from "next/navigation"

export function NavUser() {
  const user = useUser()

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??"

  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
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
              <DropdownMenuItem asChild>
                <Link href="/account">
                  <LayoutTemplate className="size-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account/profile">
                  <UserRound className="size-4" />
                  Account
                </Link>
              </DropdownMenuItem>
              {user?.username && (
                <DropdownMenuItem asChild>
                  <Link href={`/user/${user.username}`}>
                    <UserRound className="size-4" />
                    Mon profil
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href="/account/badges">
                  <Star className="size-4" />
                  Badges
                </Link>
              </DropdownMenuItem>
              {!isHomePage && (
                <DropdownMenuItem asChild>
                  <Link href="/">
                    <House className="size-4" />
                    Homepage
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            {user?.role === "ADMIN" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
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
              <LogOut />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href="/login">
          <User2 className="w-7 h-7" />
        </Link>
      )}
    </>
  )
}
