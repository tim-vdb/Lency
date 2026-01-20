import { getUser } from '@/back/lib/auth-session';
import { unauthorized } from 'next/navigation';

export default async function Users() {
  const user = await getUser();

  if (user?.role !== 'ADMIN') {
    return unauthorized();
  }


  return (
    <div className="container w-full pt-20 flex-1">
      <h1 className="text-2xl font-bold">Liste des utilisateurs</h1>
    </div>
  );
}
