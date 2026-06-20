"use client"

import { AppSidebar } from "@/front/components/Private/Global/Sidebar/app-sidebar"
import { Sheet } from "@/front/components/ui/sheet"
import { SidebarInset, SidebarProvider } from "@/front/components/ui/sidebar"
import { UserProvider } from "@/front/states/contexts/user.context"
import type { User } from "@/back/generated/prisma_client"
import { usePathname } from "next/navigation"
import { cn } from "@/front/lib/utils"
import Header from "@/front/components/Private/Global/Header"
import { AblyInitializer } from "@/front/components/Private/Global/AblyInitializer"
import { ActiveChatProvider } from "@/front/states/contexts/active-chat.context"
import { QueryProvider } from "@/front/components/providers/QueryProvider"

export function AccountShell({ user, children }: { user: User | null; children: React.ReactNode }) {
    const pathname = usePathname()
    const isDashboard = pathname === "/account"
    const isFixedLayout = !isDashboard && pathname !== "/admin"

    return (
        <QueryProvider>
        <UserProvider user={user}>
            <ActiveChatProvider>
            <AblyInitializer>
            <div className="h-screen overflow-hidden bg-gray-lighter dark:bg-gray-dark">
                <SidebarProvider className="min-h-screen gap-2 isolate pr-0! p-2 [&>div]:transition-all [&>div]:duration-800">
                    <Sheet>
                        <AppSidebar />
                        <SidebarInset className="relative bg-transparent!">
                            <Header />
                            <main
                                className={cn(
                                    "rounded-xl",
                                    isDashboard
                                        ? "overflow-y-auto md:overflow-hidden h-[calc(100vh-5rem)]"
                                        : cn("overflow-y-auto pr-2", isFixedLayout ? "pt-16 h-[calc(100vh-1rem)]" : "")
                                )}
                            >
                                {children}
                            </main>
                        </SidebarInset>
                    </Sheet>
                </SidebarProvider>
            </div>
            </AblyInitializer>
            </ActiveChatProvider>
        </UserProvider>
        </QueryProvider>
    )
}
