"use client"

import { AppSidebar } from "@/front/components/Private/Global/Sidebar/app-sidebar"
import { Sheet } from "@/front/components/ui/sheet"
import { SidebarInset, SidebarProvider } from "@/front/components/ui/sidebar"
import { UserProvider } from "@/front/context/UserContext"
import type { User } from "@/back/generated/prisma_client"
import Header from "../../../../front/components/Private/Global/Header"

export function AppShell({ user, children }: { user: User | null; children: React.ReactNode }) {
    return (
        <UserProvider user={user}>
            <div className="bg-[url('/images/bg2.jpg')] bg-cover bg-center min-h-screen">
                <SidebarProvider className="gap-2 isolate pr-0! p-2 [&>div]:transition-all [&>div]:duration-800">
                    <Sheet>
                        <AppSidebar />
                        <SidebarInset className="relative bg-transparent">
                            <Header />
                            <main className="pt-16 h-[calc(100vh-1rem)] overflow-y-auto pr-2">
                                {children}
                            </main>
                        </SidebarInset>
                    </Sheet>
                </SidebarProvider>
            </div>
        </UserProvider>
    )
}
