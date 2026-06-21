"use client";

import * as React from "react";
import { Users, Briefcase, FileText, BookOpen, Mail } from "lucide-react";
import { Card, CardContent } from "@/front/components/ui/card";
import { DASHBOARD_COLORS } from "./colors";

interface DashboardStats {
  totalUsers: number;
  totalProjects: number;
  totalPosts: number;
  totalResources: number;
  unreadEmails: number;
}

interface StatsChartProps {
  stats: DashboardStats;
}

export function StatsChart({ stats }: StatsChartProps) {
  const statItems = [
    { label: DASHBOARD_COLORS.users.name, value: stats.totalUsers, icon: Users, ...DASHBOARD_COLORS.users },
    { label: DASHBOARD_COLORS.projects.name, value: stats.totalProjects, icon: Briefcase, ...DASHBOARD_COLORS.projects },
    { label: DASHBOARD_COLORS.posts.name, value: stats.totalPosts, icon: FileText, ...DASHBOARD_COLORS.posts },
    { label: DASHBOARD_COLORS.resources.name, value: stats.totalResources, icon: BookOpen, ...DASHBOARD_COLORS.resources },
    { label: DASHBOARD_COLORS.emails.name, value: stats.unreadEmails, icon: Mail, ...DASHBOARD_COLORS.emails },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`${item.iconBg} p-3 rounded-lg`}>
                  <Icon className={`${item.textColor} h-5 w-5`} />
                </div>
              </div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                {item.label}
              </p>
              <p className={`text-3xl font-bold ${item.textColor}`}>
                {item.value}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
