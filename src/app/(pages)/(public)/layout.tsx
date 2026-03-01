import { getUser } from '@/back/lib/auth-session';
import PublicShell from '@/front/components/Public/PublicShell';
import type { Metadata } from 'next';

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

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <PublicShell user={user}>
      {children}
    </PublicShell>
  );
}
