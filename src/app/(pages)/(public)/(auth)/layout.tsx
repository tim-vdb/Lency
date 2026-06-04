import { getUser } from '@/back/lib/auth-session';
import AuthShell from './AuthShell';

export const dynamic = 'force-dynamic';

export default async function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <AuthShell user={user}>
      {children}
    </AuthShell>
  );
}
