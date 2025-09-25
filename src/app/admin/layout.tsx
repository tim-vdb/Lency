import DashboardNavbar from "@/features/Navbar/DashboardNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:justify-between md:container font-inter antialiased">
      <DashboardNavbar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
