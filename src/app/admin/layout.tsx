import DashboardNavbar from "@/features/Navbar/DashboardNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:container font-inter antialiased">
      <DashboardNavbar />
      <div className="container flex-1">{children}</div>
    </div>
  );
}
