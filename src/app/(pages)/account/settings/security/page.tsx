import { getUser } from "@/back/lib/auth-session";
import { prisma } from "@/back/lib/prisma";
import { redirect } from "next/navigation";
import SecurityA2F from "@/front/components/Private/Account/Security/SecurityA2F";
import SecurityPassword from "@/front/components/Private/Account/Security/SecurityPassword";
import SecuritySession from "@/front/components/Private/Account/Security/SecuritySession";

export default async function SecuritySection() {
    const user = await getUser();
    if (!user) redirect("/login");

    const credentialAccount = await prisma.account.findFirst({
        where: { userId: user.id, providerId: "credential" },
        select: { id: true },
    });

    const hasPassword = !!credentialAccount;

    return (
        <div className="flex flex-col gap-2">
            {hasPassword && <SecurityPassword />}
            <SecurityA2F />
            <SecuritySession />
        </div>
    );
}
