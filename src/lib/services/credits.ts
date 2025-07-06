import { getSupabaseClient } from '@/lib/supabaseClient'
import { withPerformanceMonitoring as withPerf } from '@/utils/performance-monitor'

export interface CreditPackage {
  id: string
  name: string
  description: string
  price: number
  credit: number
  stripe_price_id?: string
  base: number
  bonus: number
}

export interface PurchaseCreditsRequest {
  userId: string
  packageId?: string
  customAmount?: number
  paymentProvider: 'stripe' | 'mercado_pago'
  paymentMethod: 'credit_card' | 'debit' | 'pix' | 'boleto'
}

export const getCreditPackages = withPerf(
  async (): Promise<CreditPackage[]> => {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('rifa_packages')
      .select('id, rifas_amount, rifas_bonus, price, stripe_price_id')
      .eq('active', true)
      .order('price', { ascending: true })
    if (error) throw error
    return (data || []).map((pkg: any) => ({
      id: pkg.id,
      name: `${pkg.rifas_amount} Rifas`,
      description: pkg.rifas_bonus > 0 ? `${pkg.rifas_bonus} Rifas bônus` : 'Pacote básico',
      price: pkg.price,
      credit: pkg.rifas_amount + pkg.rifas_bonus,
      stripe_price_id: pkg.stripe_price_id || '',
      base: pkg.rifas_amount,
      bonus: pkg.rifas_bonus
    }))
  },
  'getCreditPackages'
)

export const purchaseCredits = withPerf(
  async (request: PurchaseCreditsRequest): Promise<any> => {
    const supabase = await getSupabaseClient()
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !sessionData.session) throw new Error('Usuário não autenticado')
    const token = sessionData.session.access_token
    const res = await supabase.functions.invoke('purchase-credits', {
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    if (res.error) throw res.error
    return res.data
  },
  'purchaseCredits'
) 