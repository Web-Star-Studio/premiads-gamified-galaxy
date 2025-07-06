import { getSupabaseClient } from '@/lib/supabaseClient'
import { withPerformanceMonitoring as withPerf } from '@/utils/performance-monitor'
import { MissionSubmission } from '@/types/missions'

/**
 * Fetch mission submissions with optional filters
 */
export const getSubmissions = withPerf(
  async ({ missionId, userId, status }: { missionId?: string; userId?: string; status?: string } = {}) => {
    const supabase = await getSupabaseClient()
    let q = supabase.from('mission_submissions').select('*, missions(title)')
    if (missionId) q = q.eq('mission_id', missionId)
    if (userId) q = q.eq('user_id', userId)
    if (status) q = q.eq('status', status)
    const { data, error } = await q.order('updated_at', { ascending: false })
    if (error) throw error
    return data
  },
  'getSubmissions'
)

/**
 * Insert a new mission submission
 */
export const createSubmission = withPerf(
  async (submission: MissionSubmission) => {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('mission_submissions')
      .insert([submission])
      .select()
      .single()
    if (error) throw error
    return data
  },
  'createSubmission'
)

/**
 * Validate or update status of a submission
 */
export const validateSubmission = withPerf(
  async ({
    submissionId,
    validatedBy,
    result,
    isAdmin = false,
    notes = ''
  }: {
    submissionId: string
    validatedBy: string
    result: 'aprovado' | 'rejeitado' | 'segunda_instancia'
    isAdmin?: boolean
    notes?: string
  }) => {
    console.log(`Validating submission ${submissionId} with result: ${result}`)
    const supabase = await getSupabaseClient()

    // get existing submission
    const { data: current, error: getErr } = await supabase
      .from('mission_submissions')
      .select('mission_id, user_id')
      .eq('id', submissionId)
      .single()
    if (getErr) throw getErr

    const updatePayload: Record<string, any> = {
      status: result,
      validated_by: validatedBy,
      notes,
      updated_at: new Date().toISOString()
    }
    if (isAdmin) updatePayload.is_admin_validation = true

    const { data, error: updErr } = await supabase
      .from('mission_submissions')
      .update(updatePayload)
      .eq('id', submissionId)
      .select()
      .single()
    if (updErr) throw updErr
    return data
  },
  'validateSubmission'
) 