import UserProfilePageClient from "@/front/components/Public/Community/User/UserProfilePageClient";

export default async function UserProfilePage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const { username } = await params;
    return <UserProfilePageClient username={username} />;
}
