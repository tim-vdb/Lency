import { getUser } from '@/back/lib/auth-session';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { AccountShell } from './AccountShell';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mon espace — Lency',
  robots: { index: false, follow: false },
};

export default async function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  if (!user) redirect('/login');

  return (
    <AccountShell user={user}>
      {children}
    </AccountShell>
  );
}
