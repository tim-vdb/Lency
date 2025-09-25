import { getUser } from "@/lib/auth-session";
import unauthorized from "../unauthorized";

export default async function Page() {
  const user = await getUser();

  if (user?.role !== "ADMIN") {
    return unauthorized();
  }

  return <h1>Admin Dashboard</h1>;
}
