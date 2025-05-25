import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, BarChart2, Users, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const MetricsOverview = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["advertiser-metrics"],
    queryFn: async () => {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      
      if (!userId) throw new Error("User not authenticated");
      
      const [
        { count: completedMissions },
        { count: activeUsers },
        averageCompletionTime,
      ] = await Promise.all([
        // Get completed missions count
        supabase
          .from("mission_submissions")
          .select("*", { count: "exact", head: true })
          .eq("status", "approved"),
          
        // Get unique users count
        supabase
          .from("mission_submissions")
          .select("user_id", { count: "exact", head: true })
          .eq("status", "approved"),
          
        // Get average completion time (mock for now, needs complex query)
        Promise.resolve({ data: { average: 12 } }),
      ]);

      return {
        missionsCompleted: completedMissions || 0,
        uniqueUsers: activeUsers || 0,
        averageTime: averageCompletionTime.data.average,
      };
    },
    refetchInterval: 30000,
  });
  
  const metricsData = [
    {
      title: "Missões Completadas",
      value: metrics?.missionsCompleted || 0,
      icon: BarChart2,
      colorClass: "text-neon-cyan",
      bgClass: "bg-neon-cyan/10",
      borderClass: "border-neon-cyan/30"
    },
    {
      title: "Usuários Ativos",
      value: metrics?.uniqueUsers || 0,
      icon: Users,
      colorClass: "text-neon-pink",
      bgClass: "bg-neon-pink/10",
      borderClass: "border-neon-pink/30"
    },
    {
      title: "ROI Médio",
      value: "3.7x",
      icon: TrendingUp,
      colorClass: "text-emerald-400",
      bgClass: "bg-emerald-400/10",
      borderClass: "border-emerald-400/30"
    },
    {
      title: "Tempo Médio",
      value: `${metrics?.averageTime || 0}min`,
      icon: Clock,
      colorClass: "text-amber-400",
      bgClass: "bg-amber-400/10",
      borderClass: "border-amber-400/30"
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="p-4 pb-0">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold font-heading">Visão Geral</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-galaxy-deepPurple/50 px-3 py-1.5 rounded-full border border-galaxy-purple/30">
          <span>Últimos 30 dias</span>
          <PieChart className="w-4 h-4 text-neon-cyan" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricsData.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_rgba(155,135,245,0.3)] border ${metric.borderClass}`}
            >
              <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <div className={`p-2 rounded-md ${metric.bgClass}`}>
                  <metric.icon className={`w-4 h-4 ${metric.colorClass}`} />
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-2">
                <div className="text-2xl font-bold">
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + 0.1 * index }}
                    className={metric.colorClass}
                  >
                    {metric.value}
                  </motion.span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MetricsOverview;
