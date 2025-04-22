
import { Users, BarChart2, Award, Target, TrendingUp, CheckCircle } from "lucide-react";
import type { DashboardMetrics } from "@/hooks/useDashboardMetrics";

export const getMetricsData = (metrics: DashboardMetrics) => [
  {
    title: "Usuários Totais",
    value: metrics?.totalUsers || 0,
    trend: metrics?.userGrowthRate,
    icon: Users,
    colorClass: "text-neon-cyan",
  },
  {
    title: "Missões Ativas",
    value: metrics?.activeMissions || 0,
    trend: metrics?.missionCompletionRate,
    icon: Target,
    colorClass: "text-neon-pink",
  },
  {
    title: "Pontos Distribuídos",
    value: metrics?.totalPoints.toLocaleString() || "0",
    trend: metrics?.pointsTrend,
    icon: Award,
    colorClass: "text-neon-cyan",
  },
  {
    title: "Média de Pontos/Usuário",
    value: metrics?.averagePointsPerUser.toLocaleString() || "0",
    trend: null,
    icon: BarChart2,
    colorClass: "text-neon-pink",
  },
  {
    title: "Taxa de Conclusão",
    value: `${metrics?.missionCompletionRate || 0}%`,
    trend: null,
    icon: CheckCircle,
    colorClass: "text-neon-cyan",
  },
  {
    title: "Crescimento de Usuários",
    value: `${metrics?.userGrowthRate || 0}%`,
    trend: null,
    icon: TrendingUp,
    colorClass: "text-neon-pink",
  },
];
