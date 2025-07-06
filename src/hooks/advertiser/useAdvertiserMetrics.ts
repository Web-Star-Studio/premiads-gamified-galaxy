import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useSessionCheck } from "@/hooks/auth/useSessionCheck"

async function fetchAdvertiserMetrics(userId: string) {
  if (!userId) {
    throw new Error("User not authenticated.")
  }
  console.log(`[Metrics] Fetching for advertiser ID: ${userId}`)

  const { data, error } = await supabase.rpc("get_advertiser_metrics", {
    advertiser_id_param: userId,
  })

  console.log("[Metrics] Raw data from Supabase RPC:", data)
  if (error) {
    console.error("[Metrics] Error fetching advertiser metrics:", error)
    throw new Error("Failed to fetch advertiser metrics.")
  }

  if (!data || data.length === 0) {
    console.warn("[Metrics] No data returned from RPC function.")
    return {
      missionsCompleted: 0,
      uniqueUsers: 0,
      completionRate: "0%",
      engagementRate: "0%",
    }
  }
  
  const metrics = data[0]
  const formattedMetrics = {
    missionsCompleted: metrics.missions_completed || 0,
    uniqueUsers: metrics.unique_users || 0,
    completionRate: `${(metrics.completion_rate || 0).toFixed(0)}%`,
    engagementRate: `${(metrics.engagement_rate || 0).toFixed(0)}%`,
  }

  console.log("[Metrics] Formatted metrics:", formattedMetrics)
  return formattedMetrics
}

export function useAdvertiserMetrics() {
  const { user } = useSessionCheck()
  const userId = user?.id

  return useQuery({
    queryKey: ["advertiserMetrics_v2", userId],
    queryFn: () => fetchAdvertiserMetrics(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: true,
  })
} 