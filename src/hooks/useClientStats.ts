
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ClientStats {
  tickets: number;
  points: number;
  referrals: number;
  level: string;
  ticketsTrend: number;
  pointsTrend: number;
  referralsTrend: number;
  // New stats
  completionRate: number;
  lastMonthPoints: number;
  averagePointsPerDay: number;
}

export const useClientStats = () => useQuery({
    queryKey: ["client-stats"],
    queryFn: async (): Promise<ClientStats> => {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) throw new Error("User not authenticated");
      
      const [
        { data: profile },
        { count: tickets },
        { count: referrals },
        // Historical data
        { count: lastMonthTickets },
        { count: lastMonthReferrals },
        { data: lastMonthPoints },
        { count: totalMissions },
        { count: completedMissions },
      ] = await Promise.all([
        // Current stats
        supabase
          .from("profiles")
          .select("points")
          .eq("id", user.id)
          .single(),
          
        supabase
          .from("raffle_numbers")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),
          
        supabase
          .from("referrals")
          .select("*", { count: "exact", head: true })
          .eq("referrer_id", user.id)
          .eq("status", "completed"),

        // Historical queries
        supabase
          .from("raffle_numbers")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .lt("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),

        supabase
          .from("referrals")
          .select("*", { count: "exact", head: true })
          .eq("referrer_id", user.id)
          .eq("status", "completed")
          .lt("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),

        supabase
          .from("profiles")
          .select("points")
          .eq("id", user.id)
          .lt("updated_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .single(),

        supabase
          .from("mission_submissions")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),

        supabase
          .from("mission_submissions")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("status", "approved"),
      ]);

      const points = profile?.points || 0;
      const previousPoints = lastMonthPoints?.points || 0;

      // Calculate trends
      const ticketsTrend = lastMonthTickets ? ((tickets - lastMonthTickets) / lastMonthTickets) * 100 : 0;
      const pointsTrend = previousPoints ? ((points - previousPoints) / previousPoints) * 100 : 0;
      const referralsTrend = lastMonthReferrals ? ((referrals - lastMonthReferrals) / lastMonthReferrals) * 100 : 0;

      // Calculate additional metrics
      const completionRate = totalMissions ? (completedMissions / totalMissions) * 100 : 0;
      const averagePointsPerDay = Math.round(points / 30); // Simple average over last 30 days

      // Calculate level based on points
      let level = "Iniciante";
      if (points >= 10000) level = "Mestre";
      else if (points >= 5000) level = "Experiente";
      else if (points >= 1000) level = "Intermediário";

      return {
        tickets: tickets || 0,
        points,
        referrals: referrals || 0,
        level,
        ticketsTrend,
        pointsTrend,
        referralsTrend,
        completionRate,
        lastMonthPoints: previousPoints,
        averagePointsPerDay,
      };
    },
    refetchInterval: 30000,
  });
