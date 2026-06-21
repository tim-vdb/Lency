"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/front/components/ui/card";
import {
  ChartTooltip,
} from "@/front/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/front/components/ui/select";
import { DASHBOARD_COLORS } from "./colors";

interface ChartDataPoint {
  date: string;
  users: number;
  projects: number;
  posts: number;
  resources: number;
  emails: number;
}

export function CumulativeChart() {
  const [chartData, setChartData] = React.useState<ChartDataPoint[]>([]);
  const [timeRange, setTimeRange] = React.useState("90d");
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/admin/analytics");
        if (response.ok) {
          const { data } = await response.json();
          setChartData(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const cumulativeData = React.useMemo(() => {
    if (chartData.length === 0) return [];

    const daysToShow = timeRange === "90d" ? 90 : timeRange === "30d" ? 30 : 7;
    const filtered = chartData.slice(-daysToShow);

    let cumulUsers = 0,
      cumulProjects = 0,
      cumulPosts = 0,
      cumulResources = 0,
      cumulEmails = 0;

    return filtered.map((item) => {
      cumulUsers += item.users;
      cumulProjects += item.projects;
      cumulPosts += item.posts;
      cumulResources += item.resources;
      cumulEmails += item.emails;

      return {
        date: item.date,
        users: cumulUsers,
        projects: cumulProjects,
        posts: cumulPosts,
        resources: cumulResources,
        emails: cumulEmails,
      };
    });
  }, [chartData, timeRange]);

  if (isLoading) {
    return (
      <Card className="pt-0 h-full">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Croissance cumulative</CardTitle>
            <CardDescription>Total cumulé de tous les éléments</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Chargement des analyses...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Croissance cumulative</CardTitle>
          <CardDescription>Total cumulé de tous les éléments</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-40 rounded-lg sm:ml-auto sm:flex"
            aria-label="Sélectionner une période"
          >
            <SelectValue placeholder="3 derniers mois" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              3 derniers mois
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              30 derniers jours
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              7 derniers jours
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ResponsiveContainer width="100%" height={380}>
          <AreaChart
            data={cumulativeData}
            margin={{ top: 10, right: 30, left: 0, bottom: 50 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={{ stroke: "#d1d5db", strokeWidth: 1 }}
              tickMargin={8}
              interval={Math.floor(cumulativeData.length / 6)}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("fr-FR", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: "#d1d5db", strokeWidth: 1 }}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              width={40}
            />
            <ChartTooltip
              cursor={true}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "2px solid hsl(var(--border))",
                borderRadius: "12px",
                padding: "12px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              }}
              content={({ active, payload, label }) => {
                if (!active || !payload) return null;
                return (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-foreground">
                      {new Date(label ?? 0).toLocaleDateString("fr-FR", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {payload.map((entry) => (
                        <div
                          key={String(entry.dataKey ?? entry.name)}
                          className="flex items-center gap-2 text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800"
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="font-medium text-foreground">
                            {entry.name}: <strong>{entry.value}</strong>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }}
            />
            <Area
              dataKey="users"
              type="monotone"
              fill="none"
              stroke={DASHBOARD_COLORS.users.hex}
              strokeWidth={3}
              name={DASHBOARD_COLORS.users.name}
            />
            <Area
              dataKey="projects"
              type="monotone"
              fill="none"
              stroke={DASHBOARD_COLORS.projects.hex}
              strokeWidth={3}
              name={DASHBOARD_COLORS.projects.name}
            />
            <Area
              dataKey="posts"
              type="monotone"
              fill="none"
              stroke={DASHBOARD_COLORS.posts.hex}
              strokeWidth={3}
              name={DASHBOARD_COLORS.posts.name}
            />
            <Area
              dataKey="resources"
              type="monotone"
              fill="none"
              stroke={DASHBOARD_COLORS.resources.hex}
              strokeWidth={3}
              name={DASHBOARD_COLORS.resources.name}
            />
            <Area
              dataKey="emails"
              type="monotone"
              fill="none"
              stroke={DASHBOARD_COLORS.emails.hex}
              strokeWidth={3}
              name={DASHBOARD_COLORS.emails.name}
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              formatter={(value, entry) => (
                <span style={{ color: entry.color, opacity: 0.8 }}>{value}</span>
              )}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
