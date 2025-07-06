import { getSupabaseClient } from '@/lib/supabaseClient'
import { withPerformanceMonitoring as withPerf } from '@/utils/performance-monitor'
import type { Database } from '@/types/supabase.generated'
import type { CashbackCampaign, CashbackRedemption, CashbackToken } from '@/types/cashback'

// Helpers para SHA de cashback
type CampaignRow = Database['public']['Tables']['cashback_campaigns']['Row']

function generateCashbackSHA(cashbackPercentage: number): string {
  const letters = Array.from({ length: 7 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join('')
  const numeric = cashbackPercentage.toString().padStart(3, '0')
  return `${letters}${numeric}`
}

async function isSHAUnique(shaCode: string): Promise<boolean> {
  const supabase = await getSupabaseClient()
  const { data, error } = await supabase
    .from('cashback_tokens')
    .select('id')
    .eq('sha_code', shaCode)
  if (error) return true
  return (data || []).length === 0
}

async function generateUniqueSHA(cashbackPercentage: number): Promise<string> {
  for (let i = 0; i < 5; i++) {
    const sha = generateCashbackSHA(cashbackPercentage)
    if (await isSHAUnique(sha)) return sha
  }
  throw new Error('Falha ao gerar SHA único')
}

/**
 * Retorna campanhas ativas de cashback
 */
export const fetchCashbackCampaigns = withPerf(
  async () => {
    const supabase = await getSupabaseClient()
    const now = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('cashback_campaigns')
      .select('*')
      .eq('is_active', true)
      .gte('end_date', now)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data || []) as CampaignRow[]
  },
  'fetchCashbackCampaigns'
)

/**
 * Retorna o saldo de cashback do usuário autenticado
 */
export const fetchUserCashbackBalance = withPerf(
  async () => {
    const supabase = await getSupabaseClient()
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !sessionData.session) throw new Error('Autenticação necessária')
    const userId = sessionData.session.user.id
    const { data, error } = await supabase
      .from('profiles')
      .select('cashback_balance')
      .eq('id', userId)
      .single()
    if (error) throw error
    return data?.cashback_balance ?? 0
  },
  'fetchUserCashbackBalance'
)

/**
 * Realiza resgate de cashback
 */
export const redeemCashback = withPerf(
  async ({ campaignId, amount }: { campaignId: string; amount: number }) => {
    const supabase = await getSupabaseClient()
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !sessionData.session) throw new Error('Autenticação necessária')
    const userId = sessionData.session.user.id

    // Verifica saldo
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('cashback_balance')
      .eq('id', userId)
      .single()
    if (profileError) throw profileError
    if (!profile || profile.cashback_balance < amount) throw new Error('Saldo insuficiente')

    // Verifica campanha
    const { data: campaign, error: campaignError } = await supabase
      .from('cashback_campaigns')
      .select('id, is_active, end_date, cashback_percentage, advertiser_id')
      .eq('id', campaignId)
      .single()
    if (campaignError) throw campaignError
    if (!campaign?.is_active || campaign.end_date < new Date().toISOString().split('T')[0]) throw new Error('Campanha inválida')

    // Gera SHA único
    const cashbackPercentage = Number(campaign.cashback_percentage)
    const shaCode = await generateUniqueSHA(cashbackPercentage)

    // Cria registro de resgate
    const { data: redemption, error: redemptionError } = await supabase
      .from('cashback_redemptions')
      .insert({ user_id: userId, campaign_id: campaignId, amount, status: 'completed', redeemed_at: new Date().toISOString() })
      .select()
      .single()
    if (redemptionError) throw redemptionError

    // Cria token de cashback
    await supabase
      .from('cashback_tokens')
      .insert({ user_id: userId, advertiser_id: campaign.advertiser_id, sha_code: shaCode, cashback_percentage: cashbackPercentage, status: 'ativo', validade: new Date(Date.now() + 30*24*60*60*1000).toISOString(), campaign_id: campaignId })

    return redemption as CashbackRedemption
  },
  'redeemCashback'
)

/**
 * Retorna tokens de cashback do usuário
 */
export const fetchUserCashbackTokens = withPerf(
  async () => {
    const supabase = await getSupabaseClient()
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !sessionData.session) throw new Error('Autenticação necessária')
    const userId = sessionData.session.user.id
    const { data, error } = await supabase
      .from('cashback_tokens')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as CashbackToken[]
  },
  'fetchUserCashbackTokens'
)

/**
 * Valida cupom de cashback
 */
export const validateCashbackCoupon = withPerf(
  async (shaCode: string) => {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('cashback_tokens')
      .select('*')
      .eq('sha_code', shaCode)
      .single()
    if (error) throw error
    if (!data) return { success: false, message: 'Cupom não encontrado' }
    if (data.status !== 'ativo') return { success: false, message: 'Cupom inválido' }
    return { success: true, message: 'Cupom válido', tokenData: data }
  },
  'validateCashbackCoupon'
) 