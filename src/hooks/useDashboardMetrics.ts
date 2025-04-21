
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DashboardMetrics {
  totalUsers: number;
  activeMissions: number;
  totalPoints: number;
  activeRaffles: number;
  pendingSubmissions: number;
  completedMissions: number;
}

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async (): Promise<DashboardMetrics> => {
      const [
        { count: totalUsers },
        { count: activeMissions },
        { sum: totalPoints },
        { count: activeRaffles },
        { count: pendingSubmissions },
        { count: completedMissions },
      ] = await Promise.all([
        // Count total users
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true }),
        
        // Count active missions
        supabase
          .from("missions")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true),
          
        // Sum total points
        supabase
          .from("profiles")
          .select("points"),
          
        // Count active raffles
        supabase
          .from("raffles")
          .select("*", { count: "exact", head: true })
          .eq("status", "active"),
          
        // Count pending submissions
        supabase
          .from("mission_submissions")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
          
        // Count completed missions
        supabase
          .from("mission_submissions")
          .select("*", { count: "exact", head: true })
          .eq("status", "approved"),
      ]);

      return {
        totalUsers: totalUsers || 0,
        activeMissions: activeMissions || 0,
        totalPoints: totalPoints?.reduce((acc, curr) => acc + (curr.points || 0), 0) || 0,
        activeRaffles: activeRaffles || 0,
        pendingSubmissions: pendingSubmissions || 0,
        completedMissions: completedMissions || 0,
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};
