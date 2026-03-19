"use client"

import { AppSidebar } from "@/front/components/Private/Global/Sidebar/app-sidebar"
import Footer from "@/front/components/Public/Global/Footer/Footer"
import { Sheet } from "@/front/components/ui/sheet"
import { SidebarInset, SidebarProvider } from "@/front/components/ui/sidebar"
import { UserProvider } from "@/front/context/UserContext"
import type { User } from "@/back/generated/prisma_client"
import { usePathname } from "next/navigation"
import Header from "../Global/Header"

export function AccountShell({ user, children }: { user: User | null; children: React.ReactNode }) {
    const pathname = usePathname()
    const isDashboard = pathname === '/account'

    return (
        <UserProvider user={user}>
            <div className="bg-[url('/images/bg.jpg')]">

                <SidebarProvider className="isolate mx-4">
                    <Sheet>
                        <AppSidebar className="mx-4" />
                        <SidebarInset>
                            <Header />
                            <main className="h-[calc(100vh-64px)]">{children}</main>
                            {!isDashboard && <Footer />}
                        </SidebarInset>
                    </Sheet>
                </SidebarProvider>
            </div>
        </UserProvider>
    )
}
