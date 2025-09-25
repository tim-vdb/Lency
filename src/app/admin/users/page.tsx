import { getUser } from '@/lib/auth-session';
import unauthorized from '@/app/unauthorized';

export default async function Users() {
  const user = await getUser();

  if (user?.role !== "ADMIN") {
    return unauthorized();
  }

  return <></>;
}
