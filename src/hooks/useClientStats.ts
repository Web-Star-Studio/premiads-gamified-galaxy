
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
}

export const useClientStats = () => {
  return useQuery({
    queryKey: ["client-stats"],
    queryFn: async (): Promise<ClientStats> => {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) throw new Error("User not authenticated");
      
      const [
        // Get user profile data
        { data: profile },
        // Get user's tickets (raffle numbers)
        { count: tickets },
        // Get referrals count
        { count: referrals },
      ] = await Promise.all([
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
      ]);

      // Calculate level based on points
      const points = profile?.points || 0;
      let level = "Iniciante";
      
      if (points >= 10000) level = "Mestre";
      else if (points >= 5000) level = "Experiente";
      else if (points >= 1000) level = "Intermediário";

      return {
        tickets: tickets || 0,
        points,
        referrals: referrals || 0,
        level,
        ticketsTrend: 0, // To be implemented with historical data
        pointsTrend: 0,
        referralsTrend: 0,
      };
    },
    refetchInterval: 30000,
  });
};
