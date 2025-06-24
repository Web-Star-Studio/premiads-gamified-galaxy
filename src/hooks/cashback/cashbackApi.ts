import { supabase } from '@/integrations/supabase/client'
import type { CashbackCampaign, CashbackRedemption } from '@/types/cashback'
import type { Tables } from '@/integrations/supabase/types'

export interface FetchCashbackResult {
  campaigns: CashbackCampaign[];
  userCashback: number;
}

type DatabaseCashbackCampaign = Tables<'cashback_campaigns'>

/**
 * Converts database campaign format to frontend format
 */
const convertDatabaseCampaignToFrontend = (dbCampaign: DatabaseCashbackCampaign): CashbackCampaign => ({
  id: dbCampaign.id,
  title: dbCampaign.title,
  description: dbCampaign.description || '',
  advertiser_name: dbCampaign.advertiser_name || '',
  advertiser_logo: dbCampaign.advertiser_logo || '',
  cashback_percentage: Number(dbCampaign.cashback_percentage),
  discount_percentage: Number(dbCampaign.cashback_percentage), // Same as cashback for compatibility
  category: dbCampaign.category || '',
  start_date: dbCampaign.start_date,
  end_date: dbCampaign.end_date,
  is_active: dbCampaign.is_active || false,
  created_at: dbCampaign.created_at || '',
  updated_at: dbCampaign.updated_at || ''
})

/**
 * Fetches active cashback campaigns
 */
export const fetchCashbackCampaigns = async (): Promise<CashbackCampaign[]> => {
  const now = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
  
  const { data, error } = await supabase
    .from('cashback_campaigns')
    .select('*')
    .eq('is_active', true)
    .gte('end_date', now)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  
  // Convert database format to frontend format
  return (data || []).map(convertDatabaseCampaignToFrontend)
}

/**
 * Fetches the user's cashback balance from profiles table
 */
export const fetchUserCashbackBalance = async (): Promise<number> => {
  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession()
  if (sessionError || !session) throw new Error('Autenticação necessária')
  
  const { data, error } = await supabase
    .from('profiles')
    .select('cashback_balance')
    .eq('id', session.user.id)
    .single()
  
  if (error) throw error
  return data?.cashback_balance ?? 0
}

/**
 * Redeems cashback by creating a redemption record and updating user balance
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

  // First, verify user has sufficient balance
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('cashback_balance')
    .eq('id', userId)
    .single()
  
  if (profileError) throw profileError
  if (!profile || profile.cashback_balance < amount) {
    throw new Error('Saldo insuficiente para resgate')
  }

  // Verify campaign exists and is active
  const { data: campaign, error: campaignError } = await supabase
    .from('cashback_campaigns')
    .select('id, is_active, end_date')
    .eq('id', campaignId)
    .single()
  
  if (campaignError) throw campaignError
  if (!campaign || !campaign.is_active) {
    throw new Error('Campanha não encontrada ou inativa')
  }
  
  // Check if campaign is still valid
  const now = new Date().toISOString().split('T')[0]
  if (campaign.end_date < now) {
    throw new Error('Campanha expirada')
  }

  // Generate redemption code
  const redemptionCode = 'CB' + Math.random().toString(36).substr(2, 8).toUpperCase()

  // Create redemption record
  const { data: redemption, error: redemptionError } = await supabase
    .from('cashback_redemptions')
    .insert({
      user_id: userId,
      campaign_id: campaignId,
      amount,
      code: redemptionCode,
      status: 'completed',
      redeemed_at: new Date().toISOString()
    })
    .select()
    .single()
  
  if (redemptionError) throw redemptionError

  // Update user balance
  const { error: balanceError } = await supabase
    .from('profiles')
    .update({ 
      cashback_balance: profile.cashback_balance - amount,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
  
  if (balanceError) throw balanceError

  return redemption as CashbackRedemption
}
