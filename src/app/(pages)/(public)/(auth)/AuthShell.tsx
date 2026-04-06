"use client"
import { UserProvider } from "@/front/context/UserContext";
import { User } from "@/back/generated/prisma_client";
import HeaderPublic from "@/front/components/Public/Global/Header/HeaderPublic";

export default function AuthShell({ user, children }: { user: User | null; children: React.ReactNode }) {
    return (
        <UserProvider user={user}>
            <HeaderPublic />
            <main>{children}</main>
        </UserProvider>
    );
}
