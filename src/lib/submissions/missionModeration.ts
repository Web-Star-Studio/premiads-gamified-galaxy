import { supabase } from '@/integrations/supabase/client';

export interface FinalizationResult {
  status: string;
  badge_earned: boolean;
  [key: string]: any;
}

export type ValidationStage = 'advertiser_first' | 'admin' | 'advertiser_second';

export interface FinalizeMissionSubmissionInput {
  submissionId: string;
  approverId: string;
  decision: 'approve' | 'reject';
  stage: ValidationStage;
  feedback?: string;
}

export interface FinalizeMissionSubmissionResponse {
  success: boolean;
  result?: FinalizationResult;
  error?: string;
}

/**
 * Finalizes a mission submission calling the `finalize_submission` RPC.
 * Accepts a single object (RORO) for simpler/safer invocation.
 */
export async function finalizeMissionSubmission({
  submissionId,
  approverId,
  decision,
  stage,
  feedback
}: FinalizeMissionSubmissionInput): Promise<FinalizeMissionSubmissionResponse> {
  try {
    const { data, error } = await supabase.rpc('finalize_submission', {
      p_submission_id: submissionId,
      p_approver_id: approverId,
      p_decision: decision,
      p_stage: stage
    });

    if (error) {
      console.error('Database error:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      result: (data || {}) as FinalizationResult
    };
  } catch (error: any) {
    console.error('Error finalizing submission:', error);
    return { success: false, error: error.message };
  }
}
