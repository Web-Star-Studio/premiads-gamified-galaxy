import { getSupabaseClient } from '@/services/supabase'

export interface FinalizeMissionSubmissionOpts {
  submissionId: string
  decision: 'approve' | 'reject'
  reviewerType: 'advertiser' | 'admin'
  reviewStage: 'first' | 'admin' | 'second'
}

export async function finalizeMissionSubmission({ submissionId, decision, reviewerType, reviewStage }: FinalizeMissionSubmissionOpts): Promise<void> {
  if (reviewerType === 'advertiser' && reviewStage === 'first') return handleFirstAdvertiserReview({ submissionId, decision })
  if (reviewerType === 'admin' && reviewStage === 'admin') return handleAdminReview({ submissionId, decision })
  if (reviewerType === 'advertiser' && reviewStage === 'second') return handleSecondAdvertiserReview({ submissionId, decision })
  throw new Error(`Fluxo inválido: ${reviewerType}/${reviewStage}`)
}

interface ReviewOpts {
  submissionId: string
  decision: 'approve' | 'reject'
}

async function handleFirstAdvertiserReview({ submissionId, decision }: ReviewOpts) {
  const client = await getSupabaseClient()
  const { data: submission, error: subError } = await client
    .from('mission_submissions')
    .select('mission_id,user_id')
    .eq('id', submissionId)
    .single()
  if (subError || !submission) throw subError || new Error('Submission not found')

  if (decision === 'approve') {
    await client
      .from('mission_submissions')
      .update({ status: 'approved', review_stage: 'completed' })
      .eq('id', submissionId)
    await updateMissionStatuses(submissionId, 'approved')
    await addPointsToParticipant(submissionId)
  } else {
    await client
      .from('mission_submissions')
      .update({
        status: 'second_instance_pending',
        second_instance: true,
        second_instance_status: 'pending',
        review_stage: 'under_admin_review'
      })
      .eq('id', submissionId)
  }
}

async function handleAdminReview({ submissionId, decision }: ReviewOpts) {
  const client = await getSupabaseClient()
  const updates =
    decision === 'approve'
      ? { status: 'returned_to_advertiser', second_instance_status: 'approved', review_stage: 'returned_to_advertiser' }
      : { status: 'rejected', second_instance_status: 'rejected', review_stage: 'completed' }

  await client
    .from('mission_submissions')
    .update(updates)
    .eq('id', submissionId)
}

async function handleSecondAdvertiserReview({ submissionId, decision }: ReviewOpts) {
  const client = await getSupabaseClient()
  const { data: submission, error: subError } = await client
    .from('mission_submissions')
    .select('mission_id,user_id')
    .eq('id', submissionId)
    .single()
  if (subError || !submission) throw subError || new Error('Submission not found')

  if (decision === 'approve') {
    await client
      .from('mission_submissions')
      .update({ status: 'approved', review_stage: 'completed' })
      .eq('id', submissionId)
    await updateMissionStatuses(submissionId, 'approved')
    await addPointsToParticipant(submissionId)
  } else {
    await client
      .from('mission_submissions')
      .update({ status: 'rejected', review_stage: 'completed' })
      .eq('id', submissionId)
  }
}

// utilitário: adiciona pontos ao participante via RPC ou diretamente se falhar
export async function addPointsToParticipant(submissionId: string): Promise<void> {
  const client = await getSupabaseClient()
  
  try {
    // Primeira tentativa: Chamar RPC que criamos
    await client.rpc('reward_participant_for_submission', { 
      submission_id: submissionId 
    })
    console.log('RPC reward_participant_for_submission executada com sucesso')
  } catch (error) {
    console.error('Erro ao executar RPC, usando fallback direto:', error)
    
    // Fallback: atualizar manualmente se o RPC falhar
    try {
      // 1. Buscar informações da submissão
      const { data: submission, error: subError } = await client
        .from('mission_submissions')
        .select('mission_id,user_id,status')
        .eq('id', submissionId)
        .single()
        
      if (subError || !submission) throw subError || new Error('Submissão não encontrada')
      if (submission.status !== 'approved') throw new Error('Submissão não está aprovada')
      
      // 2. Buscar pontos da missão
      const { data: mission, error: missionError } = await client
        .from('missions')
        .select('points')
        .eq('id', submission.mission_id)
        .single()
        
      if (missionError || !mission) throw missionError || new Error('Missão não encontrada')
      const pointsToAdd = mission.points || 0
      
      // 3. Verificar se já foi recompensado antes
      const { data: existingReward } = await client
        .from('mission_rewards')
        .select('id')
        .eq('submission_id', submissionId)
        .maybeSingle()
      
      if (existingReward) {
        console.log('Recompensa já registrada, pulando...')
        return
      }
      
      // 4. Buscar pontos atuais do perfil
      const { data: profile, error: profileError } = await client
        .from('profiles')
        .select('points')
        .eq('id', submission.user_id)
        .single()
      
      if (profileError) throw profileError
      const currentPoints = profile?.points || 0
      
      // 5. Iniciar uma transação com atualizações sequenciais
      
      // 5.1 Atualizar pontos do usuário
      const { error: updateError } = await client
        .from('profiles')
        .update({
          points: currentPoints + pointsToAdd,
          updated_at: new Date().toISOString()
        })
        .eq('id', submission.user_id)
      
      if (updateError) throw updateError
      
      // 5.2 Registrar recompensa
      const { error: rewardError } = await client
        .from('mission_rewards')
        .insert({
          user_id: submission.user_id,
          mission_id: submission.mission_id,
          submission_id: submissionId,
          points_earned: pointsToAdd,
          rewarded_at: new Date().toISOString()
        })
      
      if (rewardError) throw rewardError
      
      // 5.3 Atualizar status da missão 
      await client
        .from('missions')
        .update({
          status: 'ativa',
          updated_at: new Date().toISOString()
        })
        .eq('id', submission.mission_id)
      
      console.log(`Pontos (${pointsToAdd}) adicionados via fallback para usuário ${submission.user_id}`)
    } catch (fallbackError) {
      console.error('Erro fatal no fallback de pontos:', fallbackError)
      throw fallbackError
    }
  }
}

// utilitário: atualiza status da missão derivado da submissão
export async function updateMissionStatuses(submissionId: string, status: 'approved' | 'rejected'): Promise<void> {
  const client = await getSupabaseClient()
  const { data: sub, error } = await client
    .from('mission_submissions')
    .select('mission_id')
    .eq('id', submissionId)
    .single()
  if (error || !sub) throw error || new Error('Submission not found')
  await client
    .from('missions')
    .update({ status })
    .eq('id', sub.mission_id)
}

// opcional: registrar ação de moderação
export async function logModerationAction(submissionId: string, reviewerId: string, action: string, notes = ''): Promise<void> {
  const client = await getSupabaseClient()
  await client
    .from('mission_validation_logs')
    .insert({ submission_id: submissionId, validated_by: reviewerId, is_admin: false, result: action, notes })
} 