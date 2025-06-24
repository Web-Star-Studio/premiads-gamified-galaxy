import { supabase } from '@/integrations/supabase/client'
import type { CashbackCampaign, CashbackRedemption, CashbackToken } from '@/types/cashback'
import type { Tables } from '@/integrations/supabase/types'

export interface FetchCashbackResult {
  campaigns: CashbackCampaign[];
  userCashback: number;
}

type DatabaseCashbackCampaign = Tables<'cashback_campaigns'>

/**
 * Gera um código SHA único para cashback: 7 letras maiúsculas + 3 dígitos da porcentagem
 */
function generateCashbackSHA(cashbackPercentage: number): string {
  const letters = Array.from({ length: 7 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join('');
  const numeric = cashbackPercentage.toString().padStart(3, '0');
  return `${letters}${numeric}`;
}

/**
 * Verifica se o código SHA é único no banco de dados
 */
async function isSHAUnique(shaCode: string): Promise<boolean> {
  try {
    const { data, error } = await (supabase as any)
      .from('cashback_tokens')
      .select('id')
      .eq('sha_code', shaCode);
    
    if (error) {
      console.error('Error checking SHA uniqueness:', error);
      return true; // Assume unique if error
    }
    
    return data.length === 0;
  } catch {
    return true; // Assume unique if table doesn't exist yet
  }
}

/**
 * Gera um código SHA único com até 5 tentativas
 */
async function generateUniqueSHA(cashbackPercentage: number): Promise<string> {
  for (let i = 0; i < 5; i++) {
    const sha = generateCashbackSHA(cashbackPercentage);
    if (await isSHAUnique(sha)) {
      return sha;
    }
  }
  throw new Error('Falha ao gerar SHA único após múltiplas tentativas');
}

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
    .select('id, is_active, end_date, cashback_percentage, advertiser_id')
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

  // Generate unique SHA code
  const cashbackPercentage = Number(campaign.cashback_percentage);
  const shaCode = await generateUniqueSHA(cashbackPercentage);

  // Calculate validade (expiry date) - 30 days from now
  const validade = new Date();
  validade.setDate(validade.getDate() + 30);

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

  // Create cashback token with unique SHA (using any until table is created)
  try {
    await (supabase as any)
      .from('cashback_tokens')
      .insert({
        user_id: userId,
        advertiser_id: campaign.advertiser_id,
        sha_code: shaCode,
        cashback_percentage: cashbackPercentage,
        status: 'ativo',
        validade: validade.toISOString(),
        campaign_id: campaignId
      })
  } catch (tokenError) {
    console.error('Error creating cashback token:', tokenError);
    // Don't throw error here to avoid breaking the cashback redemption
    // The redemption will still work without the token
  }

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

/**
 * Fetches user's cashback tokens from the database
 */
export const fetchUserCashbackTokens = async (): Promise<CashbackToken[]> => {
  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession()
  if (sessionError || !session) throw new Error('Autenticação necessária')
  
  try {
    const { data, error } = await (supabase as any)
      .from('cashback_tokens')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching cashback tokens:', error)
      throw error
    }
    
    return (data || []) as CashbackToken[]
  } catch (error) {
    console.error('Error fetching cashback tokens:', error)
    return []
  }
}

/**
 * Validates a cashback coupon by SHA code
 */
export const validateCashbackCoupon = async (shaCode: string): Promise<{
  success: boolean;
  message: string;
  tokenData?: any;
}> => {
  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession()
  if (sessionError || !session) throw new Error('Autenticação necessária')
  
  try {
    const { data, error } = await (supabase as any).rpc('validate_cashback_coupon', {
      p_sha_code: shaCode,
      p_advertiser_id: session.user.id
    })
    
    if (error) {
      console.error('Error validating coupon:', error)
      throw error
    }
    
    // The function returns an array with a single result
    const result = data?.[0]
    
    return {
      success: result?.success || false,
      message: result?.message || 'Erro desconhecido',
      tokenData: result?.token_data
    }
  } catch (error) {
    console.error('Error validating cashback coupon:', error)
    return {
      success: false,
      message: 'Erro ao validar cupom. Tente novamente.'
    }
  }
}
