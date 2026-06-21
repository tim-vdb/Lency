import { GrowthChart } from "./GrowthChart";
import { CumulativeChart } from "./CumulativeChart";
import { StatsChart } from "./StatsChart";

interface DashboardStats {
  totalUsers: number;
  totalProjects: number;
  totalPosts: number;
  totalResources: number;
  unreadEmails: number;
}

interface AdminDashboardProps {
  stats: DashboardStats;
}

export function AdminDashboard({ stats }: AdminDashboardProps) {
  return (
    <div className="space-y-8 py-6">

      {/* Stats Cards */}
      <div>
        <StatsChart stats={stats} />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <GrowthChart />
        <CumulativeChart />
      </div>
    </div>
  );
}
