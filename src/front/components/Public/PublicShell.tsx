"use client"
import { UserProvider } from "@/front/context/UserContext";
import Footer from "./Global/Footer/Footer";
import { User } from "@/back/generated/prisma_client";
import HeaderPublic from "./Global/Header/HeaderPublic";
import { usePathname } from "next/navigation";

export default function PublicShell({ user, children }: { user: User | null; children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/sign-up");

    return (
        <UserProvider user={user}>
            <HeaderPublic />
            <main className="min-h-screen">{children}</main>
            {!isAuthPage && <Footer />}
        </UserProvider>
    );
}