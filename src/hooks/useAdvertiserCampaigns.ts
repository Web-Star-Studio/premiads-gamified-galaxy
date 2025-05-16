import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useSounds } from "@/hooks/use-sounds"

interface AdvertiserCampaign {
  id: string
  title: string
  description?: string
  requirements?: any
  type: string
  points: number
  cost_in_tokens: number
  status: string
  start_date?: string
  end_date?: string
  target_audience?: string
  target_audience_gender?: string
  target_audience_age_min?: number
  target_audience_age_max?: number
  target_audience_region?: string
  [key: string]: any
}

/**
 * Hook to fetch and subscribe to advertiser campaigns in real-time
 */
export function useAdvertiserCampaigns() {
  const [campaigns, setCampaigns] = useState<AdvertiserCampaign[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { toast } = useToast()
  const { playSound } = useSounds()

  // Fetch advertiser campaigns
  const fetchCampaigns = useCallback(async () => {
    setLoading(true)
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      const userId = sessionData?.session?.user?.id
      if (sessionError || !userId) throw new Error("Usuário não autenticado")

      const { data, error } = await supabase
        .from("missions")
        .select("*")
        .eq("advertiser_id", userId)
        .eq("is_active", true)

      if (error) throw error
      setCampaigns((data || []) as AdvertiserCampaign[])
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

  return { campaigns, loading, refreshCampaigns: fetchCampaigns }
} 