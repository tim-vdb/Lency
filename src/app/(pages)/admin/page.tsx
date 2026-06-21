import { AdminDashboard } from "@/front/components/Private/Admin/Dashboard/AdminDashboard";
import { getUser } from "@/back/lib/auth-session";
import { redirect } from "next/navigation";
import { prisma } from "@/back/lib/prisma";

interface DashboardStats {
  totalUsers: number;
  totalProjects: number;
  totalPosts: number;
  totalResources: number;
  unreadEmails: number;
}

export default async function Page() {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  let stats: DashboardStats = {
    totalUsers: 0,
    totalProjects: 0,
    totalPosts: 0,
    totalResources: 0,
    unreadEmails: 0,
  };

  try {
    const [totalUsers, totalProjects, totalPosts, totalResources, unreadEmails] =
      await Promise.all([
        prisma.user.count(),
        prisma.project.count(),
        prisma.post.count(),
        prisma.resource.count(),
        prisma.adminEmail.count({ where: { isRead: false } }),
      ]);

    stats = {
      totalUsers,
      totalProjects,
      totalPosts,
      totalResources,
      unreadEmails,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
  }

  return <AdminDashboard stats={stats} />;
}
