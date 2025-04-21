
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DashboardMetrics {
  totalUsers: number;
  activeMissions: number;
  totalPoints: number;
  activeRaffles: number;
  pendingSubmissions: number;
  completedMissions: number;
  // New metrics
  averagePointsPerUser: number;
  missionCompletionRate: number;
  userGrowthRate: number;
  pointsTrend: number;
}

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async (): Promise<DashboardMetrics> => {
      // Get current metrics
      const [
        { count: totalUsers },
        { count: activeMissions },
        { sum: totalPoints },
        { count: activeRaffles },
        { count: pendingSubmissions },
        { count: completedMissions },
        // Historical data (30 days ago)
        { count: previousMonthUsers },
        { count: previousMonthCompletedMissions },
        { sum: previousMonthPoints },
      ] = await Promise.all([
        // Current metrics
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true }),
        
        supabase
          .from("missions")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true),
          
        supabase
          .from("profiles")
          .select("points"),
          
        supabase
          .from("raffles")
          .select("*", { count: "exact", head: true })
          .eq("status", "active"),
          
        supabase
          .from("mission_submissions")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
          
        supabase
          .from("mission_submissions")
          .select("*", { count: "exact", head: true })
          .eq("status", "approved"),

        // Historical data queries
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .lt("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),

        supabase
          .from("mission_submissions")
          .select("*", { count: "exact", head: true })
          .eq("status", "approved")
          .lt("submitted_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),

        supabase
          .from("profiles")
          .select("points")
          .lt("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
      ]);

      const currentPoints = totalPoints?.reduce((acc, curr) => acc + (curr.points || 0), 0) || 0;
      const previousPoints = previousMonthPoints?.reduce((acc, curr) => acc + (curr.points || 0), 0) || 0;

      // Calculate additional metrics
      const averagePointsPerUser = totalUsers ? Math.round(currentPoints / totalUsers) : 0;
      const missionCompletionRate = activeMissions ? Math.round((completedMissions / activeMissions) * 100) : 0;
      const userGrowthRate = previousMonthUsers ? Math.round(((totalUsers - previousMonthUsers) / previousMonthUsers) * 100) : 0;
      const pointsTrend = previousPoints ? Math.round(((currentPoints - previousPoints) / previousPoints) * 100) : 0;

      return {
        totalUsers: totalUsers || 0,
        activeMissions: activeMissions || 0,
        totalPoints: currentPoints,
        activeRaffles: activeRaffles || 0,
        pendingSubmissions: pendingSubmissions || 0,
        completedMissions: completedMissions || 0,
        averagePointsPerUser,
        missionCompletionRate,
        userGrowthRate,
        pointsTrend,
      };
    },
    refetchInterval: 30000,
  });
};
