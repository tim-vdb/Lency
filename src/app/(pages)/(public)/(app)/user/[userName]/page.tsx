import type { Metadata } from 'next';
import UserProfilePageClient from "@/front/components/Public/Community/User/UserProfilePageClient";
import { UsersService } from "@/back/services/users.service";
import { getDisplayName } from "@/front/lib/utils";

interface Props {
    params: Promise<{ userName: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { userName } = await params;
    const user = await UsersService.findByUsername(userName).catch(() => null);
    if (!user) return { title: 'Profil introuvable — Lency' };
    const name = getDisplayName(user);
    return {
        title: `${name} — Lency`,
        description: `Découvrez le profil de ${name} sur Lency, la communauté des créatifs audiovisuels.`,
    };
}

export default async function UserProfilePage({ params }: Props) {
    const { userName } = await params;
    return <UserProfilePageClient username={userName} />;
}
