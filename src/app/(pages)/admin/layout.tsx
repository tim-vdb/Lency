import { getUser } from '@/back/lib/auth-session';
import { AdminShell } from '@/app/(pages)/admin/AdminShell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (user?.role !== 'ADMIN') {
    return <div>{children}</div>;
  }

  return (
    <AdminShell user={user}>
      {children}
    </AdminShell>
  );
}
