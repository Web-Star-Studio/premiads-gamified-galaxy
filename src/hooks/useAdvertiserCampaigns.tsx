import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useSounds } from "@/hooks/use-sounds"
import { Campaign } from "@/components/advertiser/campaignData"
import { useAuth } from "@/hooks/useAuth"
import { useEffect } from "react"

/**
 * Hook to fetch and subscribe to advertiser campaigns in real-time
 */
export function useAdvertiserCampaigns() {
  const { toast } = useToast()
  const { playSound } = useSounds()
  const { currentUser, isLoading: authLoading, isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

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

  // React Query for fetching campaigns
  const {
    data: campaigns = [],
    isLoading: loading,
    error,
    refetch: refreshCampaigns
  } = useQuery({
    queryKey: ['advertiser-campaigns', currentUser?.id],
    queryFn: async (): Promise<Campaign[]> => {
      if (!currentUser?.id) {
        console.error('[useAdvertiserCampaigns] User not authenticated')
        return []
      }
      
      console.log('[useAdvertiserCampaigns] Fetching campaigns for user:', currentUser.id)
      
      const { data, error } = await supabase
        .from("missions")
        .select("*, mission_submissions(count)")
        .eq("advertiser_id", currentUser.id)
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
          status,
          start_date: mission.start_date,
          end_date: mission.end_date,
          requirements: mission.requirements || [],
          // UI specific fields
          audience: mission.target_audience || "Todos",
          completions: completionsCount,
          expires: mission.end_date ? new Date(mission.end_date).toLocaleDateString() : 'N/A',
          rifas: mission.rifas,
          reward: `${mission.points} pontos`,
          // New reward feature fields with mapping for backwards compatibility
          has_badge: mission.has_badge,
          has_badges: mission.has_badge, // Legacy alias
          has_lootbox: mission.has_lootbox,
          // Include all other fields
          target_audience: mission.target_audience,
          target_audience_gender: mission.target_audience_gender,
          target_audience_age_min: mission.target_audience_age_min,
          target_audience_age_max: mission.target_audience_age_max,
          target_audience_region: mission.target_audience_region
        }
      })

      console.log('[useAdvertiserCampaigns] Processed', processedCampaigns.length, 'campaigns')
      playSound("chime")
      return processedCampaigns as Campaign[]
    },
    enabled: !!currentUser?.id && !authLoading,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  })

  // Real-time subscription
  useEffect(() => {
    if (!currentUser?.id) return

    const channel = supabase
      .channel("advertiser-campaigns")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "missions", filter: `advertiser_id=eq.${currentUser.id}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ['advertiser-campaigns', currentUser.id] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUser?.id, queryClient])

  // Handle errors
  useEffect(() => {
    if (error) {
      const errorMessage = (error as Error).message || 'Erro desconhecido'
      
      // Não mostrar toast para erros de abort esperados
      if (errorMessage.includes('Query aborted') || errorMessage.includes('timeout')) {
        console.log('[useAdvertiserCampaigns] Query cancelada ou timeout:', errorMessage)
        return
      }
      
      console.error("Erro ao carregar campanhas:", error)
      toast({ 
        title: "Erro ao carregar campanhas", 
        description: errorMessage, 
        variant: "destructive" 
      })
    }
  }, [error, toast])

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
    loading: loading || authLoading, 
    refreshCampaigns,
    stats: getCampaignStats()
  }
} 