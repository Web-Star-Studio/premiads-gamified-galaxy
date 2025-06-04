import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DashboardMetrics {
  totalUsers: number;
  activeMissions: number;
  totalRifas: number;
  activeRaffles: number;
  pendingSubmissions: number;
  completedMissions: number;
  // New metrics
  averageRifasPerUser: number;
  missionCompletionRate: number;
  userGrowthRate: number;
  rifasTrend: number;
  /** Compat fields required by UI that still expects values in "pontos" */
  totalPoints: number;
  averagePointsPerUser: number;
  pointsTrend: number;
}

export const useDashboardMetrics = () => useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async (): Promise<DashboardMetrics> => {
      // Get current metrics
      const [
        { count: totalUsers },
        { count: activeMissions },
        { data: totalRifasData },
        { count: activeRaffles },
        { count: pendingSubmissions },
        { count: completedMissions },
        // Historical data (30 days ago)
        { count: previousMonthUsers },
        { count: previousMonthCompletedMissions },
        { data: previousMonthRifasData },
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
          .select("rifas"),
          
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
          .select("rifas")
          .lt("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
      ]);

      // Calculate total rifas by summing the rifas from each profile
      const currentRifas = totalRifasData?.reduce((acc, curr) => acc + (curr.rifas || 0), 0) || 0;
      const previousRifas = previousMonthRifasData?.reduce((acc, curr) => acc + (curr.rifas || 0), 0) || 0;

      // Calculate additional metrics (rifas == pontos for backward-compat)
      const averageRifasPerUser = totalUsers ? Math.round(currentRifas / totalUsers) : 0;
      const missionCompletionRate = activeMissions ? Math.round((completedMissions / activeMissions) * 100) : 0;
      const userGrowthRate = previousMonthUsers ? Math.round(((totalUsers - previousMonthUsers) / previousMonthUsers) * 100) : 0;
      const rifasTrend = previousRifas ? Math.round(((currentRifas - previousRifas) / previousRifas) * 100) : 0;

      // Legacy values for dashboards that ainda usam "pontos"
      const totalPoints = currentRifas;
      const averagePointsPerUser = averageRifasPerUser;
      const pointsTrend = rifasTrend;

      return {
        totalUsers: totalUsers || 0,
        activeMissions: activeMissions || 0,
        totalRifas: currentRifas,
        activeRaffles: activeRaffles || 0,
        pendingSubmissions: pendingSubmissions || 0,
        completedMissions: completedMissions || 0,
        averageRifasPerUser,
        missionCompletionRate,
        userGrowthRate,
        rifasTrend,
        // Compat
        totalPoints,
        averagePointsPerUser,
        pointsTrend,
      };
    },
    refetchInterval: 30000,
  });
