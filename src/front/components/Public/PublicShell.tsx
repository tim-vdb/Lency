import { UserProvider } from "@/front/context/UserContext";
import Footer from "./Global/Footer/Footer";
import { User } from "@/back/generated/prisma_client";
import HeaderPublic from "./Global/Header/HeaderPublic";

export default function PublicShell({ user, children }: { user: User | null; children: React.ReactNode }) {
    return (
        <UserProvider user={user}>
            <HeaderPublic />
            <main className="min-h-screen">{children}</main>
            <Footer />
        </UserProvider>
    );
}