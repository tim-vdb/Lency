import { getUser } from '@/lib/auth-session'
import { GetUsers } from '@/features/Users/GetUsers/users.action'
import UsersTable from '@/features/Users/GetUsers/components/UsersTable'
import { unauthorized } from 'next/navigation'

export default async function Users() {
  const user = await getUser()

  if (user?.role !== "ADMIN") {
    return unauthorized()
  }

  const users = await GetUsers()

  return (
    <div className="container w-full pt-20 flex-1">
      <h1 className="text-2xl font-bold">Liste des utilisateurs</h1>
      <UsersTable users={users} />
    </div>
  )
}
