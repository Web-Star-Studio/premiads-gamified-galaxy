
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BarChart2, Award, Target } from "lucide-react";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { Skeleton } from "@/components/ui/skeleton";

const SystemMetrics = () => {
  const { data: metrics, isLoading } = useDashboardMetrics();

  const metricsData = [
    {
      title: "Usuários Totais",
      value: metrics?.totalUsers || 0,
      icon: Users,
      colorClass: "text-neon-cyan",
    },
    {
      title: "Missões Ativas",
      value: metrics?.activeMissions || 0,
      icon: Target,
      colorClass: "text-neon-pink",
    },
    {
      title: "Pontos Distribuídos",
      value: metrics?.totalPoints.toLocaleString() || "0",
      icon: Award,
      colorClass: "text-neon-cyan",
    },
    {
      title: "Sorteios Ativos",
      value: metrics?.activeRaffles || 0,
      icon: BarChart2,
      colorClass: "text-neon-pink",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-[150px]" />
              </CardTitle>
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[100px] mb-2" />
              <Skeleton className="h-4 w-[120px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metricsData.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.colorClass}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default SystemMetrics;
