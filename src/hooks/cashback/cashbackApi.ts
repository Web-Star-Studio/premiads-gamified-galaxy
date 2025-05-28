import { supabase } from '@/integrations/supabase/client'
import type { CashbackCampaign, CashbackRedemption } from '@/types/cashback'

export interface FetchCashbackResult {
  campaigns: CashbackCampaign[];
  userCashback: number;
}

/**
 * Fetches active cashback campaigns from Supabase
 */
export const fetchCashbackCampaigns = async (): Promise<CashbackCampaign[]> => {
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('cashback_campaigns')
    .select('*')
    .eq('is_active', true)
    .gte('end_date', now)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as CashbackCampaign[]
}

/**
 * Fetches the user's cashback balance from profiles table
 */
export const fetchUserCashbackBalance = async (): Promise<number> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('cashback_balance')
    .single()
  if (error) throw error
  return data?.cashback_balance ?? 0
}

/**
 * Redeems cashback via Supabase RPC function
 */
export const redeemCashback = async (
  campaignId: string,
  amount: number
): Promise<CashbackRedemption> => {
  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession()
  if (sessionError || !session) throw new Error('Autenticação necessária')
  const userId = session.user.id

  const { data, error } = await supabase.rpc('redeem_cashback', {
    p_user_id: userId,
    p_campaign_id: campaignId,
    p_amount: amount
  })
  if (error) throw error
  // RPC returns array of redemption objects
  const redemption = (data as any[])[0] as CashbackRedemption
  return redemption
}
