import { getUser } from '@/back/lib/auth-session';
import { AppShell } from '@/app/(pages)/(public)/(app)/AppShell';

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <AppShell user={user}>
      {children}
    </AppShell>
  );
}
