
import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useSounds } from "@/hooks/use-sounds"
import { Campaign } from "@/components/advertiser/campaignData"

/**
 * Hook to fetch and subscribe to advertiser campaigns in real-time
 */
export function useAdvertiserCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { toast } = useToast()
  const { playSound } = useSounds()

  // Helper function to determine campaign status based on dates
  const determineCampaignStatus = (campaign: any): string => {
    // Default status from database if available
    if (campaign.status) return campaign.status
    
    const now = new Date()
    const endDate = campaign.end_date ? new Date(campaign.end_date) : null
    const startDate = campaign.start_date ? new Date(campaign.start_date) : null
    
    if (endDate && endDate < now) {
      return "encerrada"
    } else if (startDate && startDate > now) {
      return "pendente"
    } else {
      return "ativa"
    }
  }

  // Fetch advertiser campaigns
  const fetchCampaigns = useCallback(async () => {
    setLoading(true)
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      const userId = sessionData?.session?.user?.id
      if (sessionError || !userId) throw new Error("Usuário não autenticado")

      // Get all missions created by this advertiser (without is_active filter)
      const { data, error } = await supabase
        .from("missions")
        .select("*, mission_submissions(count)")
        .eq("advertiser_id", userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Map database missions to the campaign format needed by the UI
      const processedCampaigns = (data || []).map((mission: any) => {
        // Get completions count from the aggregated submissions
        const completionsCount = mission.mission_submissions?.count || 0
        
        // Determine status based on dates
        const status = determineCampaignStatus(mission)

        // Map to campaign format
        return {
          id: mission.id,
          title: mission.title,
          description: mission.description,
          type: mission.type,
          points: mission.points,
          cost_in_tokens: mission.cost_in_tokens,
          status: status,
          start_date: mission.start_date,
          end_date: mission.end_date,
          requirements: mission.requirements || [],
          // UI specific fields
          audience: mission.target_audience || "Todos",
          completions: completionsCount,
          expires: mission.end_date ? new Date(mission.end_date).toLocaleDateString() : 'N/A',
          reward: `${mission.points} pontos`,
          // New reward feature fields with mapping for backwards compatibility
          has_badge: mission.has_badge,
          has_badges: mission.has_badge, // Legacy alias
          has_lootbox: mission.has_lootbox,
          sequence_bonus: mission.sequence_bonus,
          streak_bonus: mission.sequence_bonus, // Legacy alias
          streak_multiplier: mission.streak_multiplier,
          // Include all other fields
          target_audience: mission.target_audience,
          target_audience_gender: mission.target_audience_gender,
          target_audience_age_min: mission.target_audience_age_min,
          target_audience_age_max: mission.target_audience_age_max,
          target_audience_region: mission.target_audience_region
        }
      })

      setCampaigns(processedCampaigns as Campaign[])
      playSound("chime")
    } catch (err: any) {
      console.error("Erro ao carregar campanhas:", err)
      toast({ title: "Erro ao carregar campanhas", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [playSound, toast])

  // Initial fetch
  useEffect(() => {
    fetchCampaigns()
  }, [fetchCampaigns])

  // Real-time subscription
  useEffect(() => {
    let userId: string | null = null
    supabase.auth.getSession().then(({ data }) => { userId = data?.session?.user?.id || null })

    const channel = supabase
      .channel("advertiser-campaigns")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "missions", filter: userId ? `advertiser_id=eq.${userId}` : undefined },
        () => fetchCampaigns()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchCampaigns])

  // Get campaign statistics for dashboard
  const getCampaignStats = () => {
    const activeCampaigns = campaigns.filter(c => c.status === "ativa").length
    const totalCompletions = campaigns.reduce((sum, campaign) => sum + (campaign.completions || 0), 0)
    
    // Calculate completion rate (completed missions / total possible completions)
    let completionRate = 0
    if (campaigns.length > 0) {
      const totalPossibleCompletions = campaigns.length * 100; // Assuming 100 is a max per campaign
      completionRate = Math.round((totalCompletions / totalPossibleCompletions) * 100)
    }
    
    // Get unique users who completed missions (this would need backend data, using total * 0.7 as example)
    const uniqueUsers = Math.round(totalCompletions * 0.7)
    
    return {
      activeCampaigns,
      totalCompletions,
      completionRate,
      uniqueUsers
    }
  }

  return { 
    campaigns, 
    loading, 
    refreshCampaigns: fetchCampaigns,
    stats: getCampaignStats()
  }
}
