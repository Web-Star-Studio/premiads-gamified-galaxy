
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Users, BarChart2, Award, Target, TrendingUp, CheckCircle } from "lucide-react";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { Skeleton } from "@/components/ui/skeleton";

const SystemMetrics = () => {
  const { data: metrics, isLoading, error } = useDashboardMetrics();

  const metricsData = [
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

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
        Erro ao carregar métricas. Por favor, tente novamente.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="relative overflow-hidden">
            <div className="p-6 space-y-4">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-8 w-[100px]" />
              <Skeleton className="h-4 w-[120px]" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metricsData.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(155,135,245,0.3)]">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">{metric.title}</h3>
                <metric.icon className={`h-4 w-4 ${metric.colorClass}`} />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold">{metric.value}</p>
                {metric.trend !== null && (
                  <p className={`text-sm ${metric.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    <TrendingUp className={`inline-block h-4 w-4 mr-1 ${metric.trend < 0 ? 'transform rotate-180' : ''}`} />
                    {Math.abs(metric.trend)}% em relação ao mês anterior
                  </p>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default SystemMetrics;
