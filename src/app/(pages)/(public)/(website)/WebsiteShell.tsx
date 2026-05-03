"use client"
import { UserProvider } from "@/front/context/UserContext";
import { ModalRenderer } from "@/front/components/Modals/ModalRenderer";
import Footer from "@/front/components/Public/Global/Footer/Footer";
import { User } from "@/back/generated/prisma_client";
import HeaderPublic from "@/front/components/Public/Global/Header/HeaderPublic";

export default function WebsiteShell({ user, children }: { user: User | null; children: React.ReactNode }) {
    return (
        <UserProvider user={user}>
            <HeaderPublic />
            <main>{children}</main>
            <Footer />
            <ModalRenderer />
        </UserProvider>
    );
}
