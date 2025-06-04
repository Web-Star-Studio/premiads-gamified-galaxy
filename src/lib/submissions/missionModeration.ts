
import { supabase } from '@/integrations/supabase/client';

export interface FinalizationResult {
  status: string;
  badge_earned: boolean;
  [key: string]: any;
}

export async function finalizeMissionSubmission(
  submissionId: string,
  approverId: string,
  decision: 'approve' | 'reject',
  stage: 'advertiser_first' | 'admin' | 'advertiser_second'
): Promise<FinalizationResult> {
  try {
    const { data, error } = await supabase.rpc('finalize_submission', {
      p_submission_id: submissionId,
      p_approver_id: approverId,
      p_decision: decision,
      p_stage: stage
    });

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    // Ensure we return a properly typed result
    const result = data as unknown;
    
    if (typeof result === 'object' && result !== null) {
      return result as FinalizationResult;
    }
    
    // Fallback if the result is not in expected format
    return {
      status: decision === 'approve' ? 'approved' : 'rejected',
      badge_earned: false
    };
  } catch (error: any) {
    console.error('Error finalizing submission:', error);
    throw new Error(`Failed to finalize submission: ${error.message}`);
  }
}
