
import { supabase } from '@/integrations/supabase/client';

export type ValidationStage = 'advertiser_first' | 'admin' | 'advertiser_second';

export interface FinalizationResult {
  status: string;
  badge_earned: boolean;
  badge_id?: string;
  badge_image_url?: string;
  loot_box_reward?: string;
  loot_box_amount?: number;
  loot_box_display_name?: string;
  loot_box_description?: string;
  streak_bonus?: number;
  current_streak?: number;
}

export async function finalizeMissionSubmission({
  submissionId,
  approverId,
  decision,
  stage,
  feedback
}: {
  submissionId: string;
  approverId: string;
  decision: 'approve' | 'reject';
  stage: ValidationStage;
  feedback?: string;
}): Promise<{ success: boolean; error?: string; result?: FinalizationResult }> {
  if (!submissionId || !approverId) {
    return { success: false, error: 'Parâmetros obrigatórios não fornecidos' };
  }

  try {
    console.log('Finalizing submission:', {
      submissionId,
      approverId,
      decision,
      stage,
      feedback
    });

    // Call the finalize_submission function
    const { data, error } = await supabase.rpc('finalize_submission', {
      p_submission_id: submissionId,
      p_approver_id: approverId,
      p_decision: decision,
      p_stage: stage
    });

    if (error) {
      console.error('Error in finalize_submission RPC:', error);
      return { success: false, error: error.message };
    }

    console.log('finalize_submission RPC result:', data);

    // Parse the result and ensure it matches our FinalizationResult interface
    const result = data as FinalizationResult;

    return { 
      success: true, 
      result: {
        status: result.status || 'unknown',
        badge_earned: Boolean(result.badge_earned),
        badge_id: result.badge_id,
        badge_image_url: result.badge_image_url,
        loot_box_reward: result.loot_box_reward,
        loot_box_amount: result.loot_box_amount,
        loot_box_display_name: result.loot_box_display_name,
        loot_box_description: result.loot_box_description,
        streak_bonus: result.streak_bonus,
        current_streak: result.current_streak
      }
    };
  } catch (error: any) {
    console.error('Error finalizing submission:', error);
    return { success: false, error: error.message || 'Erro interno do servidor' };
  }
}
