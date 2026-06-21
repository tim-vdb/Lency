import { getUser } from '@/back/lib/auth-session';
import { UserProvider } from '@/front/states/contexts/user.context';
import HeaderPublic from '@/front/components/Public/Global/Header/HeaderPublic';

export const dynamic = 'force-dynamic';

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <UserProvider user={user}>
      <HeaderPublic />
      <main>{children}</main>
    </UserProvider>
  );
}
