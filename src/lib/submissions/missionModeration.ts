
import { getSupabaseClient } from '@/services/supabase'

export interface FinalizeMissionSubmissionOpts {
  submissionId: string
  decision: 'approve' | 'reject'
  reviewerType: 'advertiser' | 'admin'
  reviewStage: 'first' | 'admin' | 'second'
}

export async function finalizeMissionSubmission({ submissionId, decision, reviewerType, reviewStage }: FinalizeMissionSubmissionOpts): Promise<void> {
  const client = await getSupabaseClient()
  
  try {
    // Map JavaScript stage names to SQL function parameter names
    let dbStage: string
    
    if (reviewerType === 'advertiser' && reviewStage === 'first') {
      dbStage = 'advertiser_first'
    } else if (reviewerType === 'admin' && reviewStage === 'admin') {
      dbStage = 'admin'
    } else if (reviewerType === 'advertiser' && reviewStage === 'second') {
      dbStage = 'advertiser_second'
    } else {
      throw new Error(`Fluxo inválido: ${reviewerType}/${reviewStage}`)
    }
    
    // Call the finalize_submission function
    const { data: result, error } = await client.rpc('finalize_submission', {
      p_submission_id: submissionId,
      p_approver_id: client.auth.getUser().then(res => res.data.user?.id),
      p_decision: decision,
      p_stage: dbStage
    })
    
    if (error) throw error
    
    console.log('Submission finalized successfully:', result)
    
    return
  } catch (error) {
    console.error('Error finalizing submission:', error)
    throw error
  }
}

// Fallback functions that get called if the RPC fails
export async function addPointsToParticipant(submissionId: string): Promise<void> {
  const client = await getSupabaseClient()
  
  try {
    // Call reward_participant_for_submission RPC which handles both points and tokens
    const { error } = await client.rpc('reward_participant_for_submission', { 
      submission_id: submissionId 
    })
    
    if (error) throw error
    console.log('Participant rewarded successfully via reward_participant_for_submission')
  } catch (error) {
    console.error('Error rewarding participant:', error)
    throw error
  }
}

// Update statuses in the database
export async function updateMissionStatuses(submissionId: string, status: 'approved' | 'rejected'): Promise<void> {
  const client = await getSupabaseClient()
  const { data: sub, error } = await client
    .from('mission_submissions')
    .select('mission_id')
    .eq('id', submissionId)
    .single()
  
  if (error || !sub) throw error || new Error('Submission not found')
  
  const { error: updateError } = await client
    .from('missions')
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', sub.mission_id)
  
  if (updateError) throw updateError
}

// Optional: Log moderation action
export async function logModerationAction(submissionId: string, reviewerId: string, action: string, notes = ''): Promise<void> {
  const client = await getSupabaseClient()
  const { error } = await client
    .from('mission_validation_logs')
    .insert({ 
      submission_id: submissionId, 
      validated_by: reviewerId, 
      is_admin: false, 
      result: action, 
      notes
    })
  
  if (error) throw error
}
