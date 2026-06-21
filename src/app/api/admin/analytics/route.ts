import { NextResponse } from "next/server";
import { getUser } from "@/back/lib/auth-session";
import { prisma } from "@/back/lib/prisma";
import dayjs from "dayjs";

export async function GET() {
  try {
    const user = await getUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get last 90 days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 90);

    const [users, projects, posts, resources, emails] = await Promise.all([
      prisma.user.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true },
      }),
      prisma.project.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true },
      }),
      prisma.post.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true },
      }),
      prisma.resource.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true },
      }),
      prisma.adminEmail.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true },
      }),
    ]);

    // Group by date
    const dateMap = new Map<string, { users: number; projects: number; posts: number; resources: number; emails: number }>();

    // Initialize all dates in range with 0
    for (let i = 89; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = dayjs(date).format("YYYY-MM-DD");
      dateMap.set(dateStr, { users: 0, projects: 0, posts: 0, resources: 0, emails: 0 });
    }

    // Count items by date
    users.forEach((u) => {
      const dateStr = dayjs(u.createdAt).format("YYYY-MM-DD");
      const current = dateMap.get(dateStr) || { users: 0, projects: 0, posts: 0, resources: 0, emails: 0 };
      current.users += 1;
      dateMap.set(dateStr, current);
    });

    projects.forEach((p) => {
      const dateStr = dayjs(p.createdAt).format("YYYY-MM-DD");
      const current = dateMap.get(dateStr) || { users: 0, projects: 0, posts: 0, resources: 0, emails: 0 };
      current.projects += 1;
      dateMap.set(dateStr, current);
    });

    posts.forEach((p) => {
      const dateStr = dayjs(p.createdAt).format("YYYY-MM-DD");
      const current = dateMap.get(dateStr) || { users: 0, projects: 0, posts: 0, resources: 0, emails: 0 };
      current.posts += 1;
      dateMap.set(dateStr, current);
    });

    resources.forEach((r) => {
      const dateStr = dayjs(r.createdAt).format("YYYY-MM-DD");
      const current = dateMap.get(dateStr) || { users: 0, projects: 0, posts: 0, resources: 0, emails: 0 };
      current.resources += 1;
      dateMap.set(dateStr, current);
    });

    emails.forEach((e) => {
      const dateStr = dayjs(e.createdAt).format("YYYY-MM-DD");
      const current = dateMap.get(dateStr) || { users: 0, projects: 0, posts: 0, resources: 0, emails: 0 };
      current.emails += 1;
      dateMap.set(dateStr, current);
    });

    // Convert to array and sort by date
    const chartData = Array.from(dateMap.entries())
      .map(([date, counts]) => ({
        date,
        ...counts,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return NextResponse.json({ data: chartData });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
