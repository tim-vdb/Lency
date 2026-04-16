"use client"

import { AppSidebar } from "@/front/components/Private/Global/Sidebar/app-sidebar"
import Footer from "@/front/components/Public/Global/Footer/Footer"
import { Sheet } from "@/front/components/ui/sheet"
import { SidebarInset, SidebarProvider } from "@/front/components/ui/sidebar"
import { UserProvider } from "@/front/context/UserContext"
import type { User } from "@/back/generated/prisma_client"
import { usePathname } from "next/navigation"
import Header from "../../../front/components/Private/Global/Header"

export function AdminShell({ user, children }: { user: User | null; children: React.ReactNode }) {
    const pathname = usePathname()
    const isDashboard = pathname === '/admin'

    return (
        <UserProvider user={user}>
            <SidebarProvider className="isolate">
                <Sheet>
                    <AppSidebar />
                    <SidebarInset>
                        <Header />
                        <main className="h-[calc(100vh-64px)]">{children}</main>
                        {!isDashboard && <Footer />}
                    </SidebarInset>
                </Sheet>
            </SidebarProvider>
        </UserProvider>
    )
}
