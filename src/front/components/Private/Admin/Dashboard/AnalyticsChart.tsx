"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/front/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/front/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/front/components/ui/select";

const chartData = [
  { date: "2024-04-01", users: 222, projects: 150 },
  { date: "2024-04-02", users: 297, projects: 180 },
  { date: "2024-04-03", users: 367, projects: 220 },
  { date: "2024-04-04", users: 442, projects: 260 },
  { date: "2024-04-05", users: 573, projects: 290 },
  { date: "2024-04-06", users: 701, projects: 340 },
  { date: "2024-04-07", users: 745, projects: 380 },
  { date: "2024-04-08", users: 809, projects: 420 },
  { date: "2024-04-09", users: 859, projects: 450 },
  { date: "2024-04-10", users: 901, projects: 480 },
  { date: "2024-04-11", users: 1027, projects: 530 },
  { date: "2024-04-12", users: 1092, projects: 580 },
  { date: "2024-04-13", users: 1142, projects: 620 },
  { date: "2024-04-14", users: 1237, projects: 680 },
  { date: "2024-04-15", users: 1320, projects: 720 },
  { date: "2024-04-16", users: 1438, projects: 780 },
  { date: "2024-04-17", users: 1575, projects: 850 },
  { date: "2024-04-18", users: 1664, projects: 920 },
  { date: "2024-04-19", users: 1743, projects: 980 },
  { date: "2024-04-20", users: 1789, projects: 1050 },
  { date: "2024-04-21", users: 1837, projects: 1120 },
  { date: "2024-04-22", users: 1924, projects: 1170 },
  { date: "2024-04-23", users: 2038, projects: 1230 },
  { date: "2024-04-24", users: 2138, projects: 1290 },
  { date: "2024-04-25", users: 2215, projects: 1350 },
  { date: "2024-04-26", users: 2275, projects: 1400 },
  { date: "2024-04-27", users: 2383, projects: 1470 },
  { date: "2024-04-28", users: 2422, projects: 1520 },
  { date: "2024-04-29", users: 2515, projects: 1600 },
  { date: "2024-04-30", users: 2654, projects: 1680 },
  { date: "2024-05-01", users: 2765, projects: 1750 },
];

const chartConfig = {
  users: {
    label: "Utilisateurs",
    color: "var(--chart-1)",
  },
  projects: {
    label: "Projets",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface AnalyticsChartProps {
  title?: string;
  description?: string;
}

export function AnalyticsChart({
  title = "Croissance utilisateurs & projets",
  description = "Utilisateurs et projets créés au fil du temps",
}: AnalyticsChartProps) {
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
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
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-users)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-users)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillProjects" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-projects)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-projects)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("fr-FR", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value: string | number) => {
                    return new Date(value).toLocaleDateString("fr-FR", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="projects"
              type="natural"
              fill="url(#fillProjects)"
              stroke="var(--color-projects)"
              stackId="a"
            />
            <Area
              dataKey="users"
              type="natural"
              fill="url(#fillUsers)"
              stroke="var(--color-users)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
