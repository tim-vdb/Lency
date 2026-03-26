"use client"

import { AppSidebar } from "@/front/components/Private/Global/Sidebar/app-sidebar"
import { Sheet } from "@/front/components/ui/sheet"
import { SidebarInset, SidebarProvider } from "@/front/components/ui/sidebar"
import { UserProvider } from "@/front/context/UserContext"
import type { User } from "@/back/generated/prisma_client"
import Header from "../Global/Header"
import { usePathname } from "next/navigation"
import { cn } from "@/front/lib/utils"

export function AccountShell({ user, children }: { user: User | null; children: React.ReactNode }) {
    const pathname = usePathname()
    const isFixedLayout = pathname !== "/account" && pathname !== "/admin"

    return (
        <UserProvider user={user}>
            <div className="bg-[url('/images/bg2.jpg')] bg-cover bg-center">
                <SidebarProvider className="gap-2 isolate pr-0! p-2 2xl:p-4">
                    <Sheet>
                        <AppSidebar className={isFixedLayout ? "fixed left-2 z-50" : ""} />
                        <SidebarInset className="relative bg-transparent!">
                            <Header />
                            {/* <main className={cn("", isFixedLayout ? "pt-20" : "")}>
                                <div className="overflow-hidden h-screen">
                                    {children}
                                </div>
                            </main> */}
                            {/* <main className={cn("flex flex-col flex-1", isFixedLayout ? "pt-20" : "")}>
                                <div className="overflow-y-auto flex-1">
                                    {children}
                                </div>
                            </main> */}
                            <main className={cn("overflow-y-auto pr-2 rounded-xl", isFixedLayout ? "pt-16 h-[calc(100vh-1rem)]" : "")}>
                                {children}
                            </main>
                        </SidebarInset>
                    </Sheet>
                </SidebarProvider>
            </div>
        </UserProvider>
    )
}
