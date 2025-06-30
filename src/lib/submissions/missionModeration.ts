
export interface ModerateMissionSubmissionInput {
  submissionId: string;
  moderatorId: string; // Changed from approverId to moderatorId
  decision: 'approve' | 'reject';
  stage: ValidationStage;
  feedback?: string;
}

export interface ModerateMissionSubmissionResponse {
  success: boolean;
  error?: string;
}

export type ValidationStage = 'advertiser_first' | 'admin' | 'advertiser_second';

export async function finalizeMissionSubmission(input: ModerateMissionSubmissionInput): Promise<ModerateMissionSubmissionResponse> {
  try {
    console.log('Finalizing mission submission:', input);
    
    // Mock implementation for now - replace with actual Supabase logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true
    };
  } catch (error: any) {
    console.error('Error finalizing submission:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred'
    };
  }
}
