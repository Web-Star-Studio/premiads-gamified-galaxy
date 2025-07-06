import { getSupabaseClient } from '@/lib/supabaseClient'
import { withPerformanceMonitoring as withPerf } from '@/utils/performance-monitor'

export interface ValidationResult {
  valid: boolean
  referenciaId?: string
  participanteId?: string
  ownerName?: string
  error?: string
}

async function _validateReferralCodeStandalone(codigo: string): Promise<ValidationResult> {
  try {
    if (!codigo?.trim().length) return { valid: false, error: 'Código não pode estar vazio' }

    const cleanCode = codigo.trim().toUpperCase()
    if (cleanCode.length < 3) return { valid: false, error: 'Código muito curto' }

    const supabase = await getSupabaseClient()
    // Edge Function
    try {
      const { data, error } = await supabase.functions.invoke('referral-system', {
        body: { action: 'validate_code', referralCode: cleanCode }
      })
      if (!error && data?.success) {
        return {
          valid: true,
          referenciaId: data.data?.referenciaId,
          participanteId: data.data?.ownerId,
          ownerName: data.data?.ownerName
        }
      }
      return { valid: false, error: data?.error || 'Código inválido' }
    } catch (fnErr) {
      console.warn('Edge Function falhou, fallback ao banco:', fnErr)
    }

    // Fallback: tabela referencias
    const { data: refData, error: refErr } = await supabase
      .from('referencias')
      .select('id, participante_id')
      .eq('codigo', cleanCode)
      .maybeSingle()
    if (refErr) return { valid: false, error: 'Erro ao consultar código' }
    if (!refData) return { valid: false, error: 'Código não encontrado' }

    // Checa perfil ativo
    const { data: profile, error: profErr } = await supabase
      .from('profiles')
      .select('full_name, active')
      .eq('id', refData.participante_id)
      .single()
    if (profErr || !profile?.active) return { valid: false, error: 'Código inválido ou inativo' }

    return { valid: true, referenciaId: refData.id, participanteId: refData.participante_id, ownerName: profile.full_name }
  } catch (e: any) {
    console.error('Erro inesperado na validação de código:', e)
    return { valid: false, error: 'Erro inesperado ao validar código' }
  }
}

export const validateReferralCodeStandalone = withPerf(
  _validateReferralCodeStandalone,
  'validateReferralCodeStandalone'
)

export interface ReferralStats {
  totalConvites: number
  pendentes: number
  registrados: number
  pontosGanhos: number
}

export const getReferralStats = withPerf(
  async ({ userId }: { userId: string }): Promise<ReferralStats> => {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase.functions.invoke('referral-system', {
      body: { action: 'get_stats', userId }
    })
    if (error) throw error
    if (!data?.success) throw new Error(data.error || 'Erro ao obter estatísticas')
    return data.data as ReferralStats
  },
  'getReferralStats'
) 