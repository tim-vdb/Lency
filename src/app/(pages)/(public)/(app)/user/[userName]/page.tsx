import UserProfilePageClient from "@/front/components/Public/Community/User/UserProfilePageClient";

export default async function UserProfilePage({
    params,
}: {
    params: Promise<{ userName: string }>;
}) {
    const { userName } = await params;
    return <UserProfilePageClient userName={userName} />;
}
