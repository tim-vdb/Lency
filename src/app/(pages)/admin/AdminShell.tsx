"use client"

import { AppSidebar } from "@/front/components/Private/Global/Sidebar/app-sidebar"
import { Sheet } from "@/front/components/ui/sheet"
import { SidebarInset, SidebarProvider } from "@/front/components/ui/sidebar"
import { UserProvider } from "@/front/states/contexts/user.context"
import type { User } from "@/back/generated/prisma_client"
import { usePathname } from "next/navigation"
import Header from "../../../front/components/Private/Global/Header"
import { cn } from "@/front/lib/utils"

export function AdminShell({ user, children }: { user: User | null; children: React.ReactNode }) {
    const pathname = usePathname()
    const isFixedLayout = pathname !== "/account" && pathname !== "/admin"

    return (
        <UserProvider user={user}>
            <div className="bg-gray-lighter dark:bg-gray-dark min-h-screen">
                <SidebarProvider className="min-h-screen gap-2 isolate pr-0! p-2 [&>div]:transition-all [&>div]:duration-800">
                    <Sheet>
                        <AppSidebar />
                        <SidebarInset className="relative bg-transparent!">
                            <Header />
                            <main
                                className={cn(
                                    "overflow-y-auto pr-2 rounded-xl dark:text-white",
                                    isFixedLayout ? "pt-16 h-[calc(100vh-1rem)]" : ""
                                )}
                            >
                                {children}
                            </main>
                        </SidebarInset>
                    </Sheet>
                </SidebarProvider>
            </div>
        </UserProvider>
    )
}
