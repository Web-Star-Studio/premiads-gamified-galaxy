import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import type { CampaignAnalyticsData } from "./useCampaignExport"

async function fetchAdvertiserCampaignsData(advertiserId: string): Promise<CampaignAnalyticsData[]> {
  if (!advertiserId) {
    throw new Error("Advertiser ID is required")
  }

  console.log(`[CampaignAnalytics] Fetching data for advertiser: ${advertiserId}`)

  try {
    // Buscar campanhas do anunciante com estatísticas de submissões
    const { data: campaignsData, error } = await supabase
      .from("missions")
      .select(`
        id,
        title,
        status,
        mission_submissions(
          id,
          status
        )
      `)
      .eq("advertiser_id", advertiserId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[CampaignAnalytics] Error fetching campaigns:", error)
      throw new Error(`Failed to fetch campaign analytics data: ${error.message}`)
    }

    if (!campaignsData || campaignsData.length === 0) {
      console.warn("[CampaignAnalytics] No campaigns found for advertiser")
      return []
    }

    // Processar dados para calcular estatísticas
    const analyticsData: CampaignAnalyticsData[] = campaignsData.map(campaign => {
      const submissions = campaign.mission_submissions || []
      const totalSubmissions = submissions.length
      const approvedSubmissions = submissions.filter((s: any) => s.status === 'approved').length
      const pendingSubmissions = submissions.filter((s: any) => s.status === 'pending').length
      const rejectedSubmissions = submissions.filter((s: any) => s.status === 'rejected').length
      
      const approvalRate = totalSubmissions > 0 
        ? Math.round((approvedSubmissions / totalSubmissions) * 100) 
        : 0

      return {
        id: campaign.id,
        name: campaign.title,
        status: campaign.status || 'ativa',
        submissions: totalSubmissions,
        approved: approvedSubmissions,
        pending: pendingSubmissions,
        rejected: rejectedSubmissions,
        approvalRate
      }
    })

    console.log("[CampaignAnalytics] Processed analytics data:", analyticsData)
    return analyticsData
  } catch (error) {
    console.error("[CampaignAnalytics] Unexpected error:", error)
    throw error
  }
}

export function useAdvertiserCampaignsData() {
  const { user } = useAuth()
  const advertiserId = user?.id

  return useQuery({
    queryKey: ["advertiserCampaignsData", advertiserId],
    queryFn: () => fetchAdvertiserCampaignsData(advertiserId!),
    enabled: !!advertiserId,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
} 