import { NextResponse } from "next/server";
import { getUser } from "@/back/lib/auth-session";
import { prisma } from "@/back/lib/prisma";

export async function GET() {
  try {
    const user = await getUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [totalUsers, totalProjects, totalPosts, totalResources, unreadEmails] =
      await Promise.all([
        prisma.user.count(),
        prisma.project.count(),
        prisma.post.count(),
        prisma.resource.count(),
        prisma.adminEmail.count({ where: { isRead: false } }),
      ]);

    return NextResponse.json({
      totalUsers,
      totalProjects,
      totalPosts,
      totalResources,
      unreadEmails,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
