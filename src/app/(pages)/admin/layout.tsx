import { getUser } from '@/back/lib/auth-session';
import { AdminShell } from '@/app/(pages)/admin/AdminShell';

export const dynamic = 'force-dynamic';
import { redirect, unauthorized } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) redirect('/login');
  if (user.role !== 'ADMIN') unauthorized();

  return (
    <AdminShell user={user}>
      {children}
    </AdminShell>
  );
}
