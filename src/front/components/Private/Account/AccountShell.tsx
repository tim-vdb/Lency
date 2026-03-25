"use client"

import { AppSidebar } from "@/front/components/Private/Global/Sidebar/app-sidebar"
import { Sheet } from "@/front/components/ui/sheet"
import { SidebarInset, SidebarProvider } from "@/front/components/ui/sidebar"
import { UserProvider } from "@/front/context/UserContext"
import type { User } from "@/back/generated/prisma_client"
import Header from "../Global/Header"

export function AccountShell({ user, children }: { user: User | null; children: React.ReactNode }) {

    return (
        <UserProvider user={user}>
            <div className="bg-[url('/images/bg2.jpg')] bg-cover bg-center">
                <SidebarProvider className="isolate p-2 2xl:p-4">
                    <Sheet>
                        <AppSidebar />
                        <SidebarInset className="bg-transparent!">
                            <Header />
                            <main>{children}</main>
                        </SidebarInset>
                    </Sheet>
                </SidebarProvider>
            </div>
        </UserProvider>
    )
}
