import { getUser } from '@/back/lib/auth-session';
import WebsiteShell from '@/app/(pages)/(public)/(website)/WebsiteShell';

export default async function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <WebsiteShell user={user}>
      {children}
    </WebsiteShell>
  );
}
