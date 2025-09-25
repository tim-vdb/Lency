import DashboardNavbar from "@/features/Navbar/DashboardNavbar";
import { getUser } from "@/lib/auth-session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (user?.role !== "ADMIN") {
    return <div>{children}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:container font-inter antialiased">
      <DashboardNavbar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
