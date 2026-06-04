"use client"

import { AppSidebar } from "@/front/components/Private/Global/Sidebar/app-sidebar"
import { Sheet } from "@/front/components/ui/sheet"
import { SidebarInset, SidebarProvider } from "@/front/components/ui/sidebar"
import { UserProvider } from "@/front/states/contexts/user.context"
import { ModalRenderer } from "@/front/components/Modals/ModalRenderer"
import type { User } from "@/back/generated/prisma_client"
import Header from "../../../../front/components/Private/Global/Header"
import { AblyInitializer } from "@/front/components/Private/Global/AblyInitializer"
import { QueryProvider } from "@/front/components/providers/QueryProvider"

export function AppShell({ user, children }: { user: User | null; children: React.ReactNode }) {
    return (
        <QueryProvider>
        <UserProvider user={user}>
            <AblyInitializer>
                <div className="bg-gray-lighter dark:bg-gray-dark min-h-screen">
                    <SidebarProvider className="gap-2 isolate pr-0! p-2 [&>div]:transition-all [&>div]:duration-800">
                        <Sheet>
                            <AppSidebar />
                            <SidebarInset className="relative bg-transparent">
                                <Header />
                                <main className="pt-2 md:pt-16 h-[calc(100vh-1rem)] overflow-y-auto pr-2">
                                    {children}
                                </main>
                            </SidebarInset>
                        </Sheet>
                    </SidebarProvider>
                </div>
                <ModalRenderer />
            </AblyInitializer>
        </UserProvider>
        </QueryProvider>
    )
}
