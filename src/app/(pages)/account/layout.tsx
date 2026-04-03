import { getUser } from '@/back/lib/auth-session';
import type { Metadata } from 'next';
import { AccountShell } from './AccountShell';

// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// });

// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// });

export const metadata: Metadata = {
  title: 'Boilerplate',
  description: 'Boilerplate Next.js 16',
};

export default async function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <AccountShell user={user}>
      {children}
    </AccountShell>
  );
}
