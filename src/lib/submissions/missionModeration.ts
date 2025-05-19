
import { supabase } from "@/integrations/supabase/client";
import { MissionSubmission, Submission, Mission } from "@/types/missions";
import { toSubmission } from "@/types/missions";

// Different validation stages
export type ValidationStage = "advertiser_first" | "admin" | "advertiser_second";

// Result of the validation decision
export type ValidationDecision = "approve" | "reject";

// Submission status enum
export type SubmissionStatus = "pending" | "approved" | "rejected" | "second_instance_pending" | "returned_to_advertiser";

export interface ValidationResult {
  success: boolean;
  error?: string;
  data?: any;
}

export interface FinalizeMissionSubmissionOpts {
  submissionId: string;
  approverId: string;
  decision: ValidationDecision;
  stage: ValidationStage;
}

/**
 * Finalizes a mission submission with approval or rejection
 */
export async function finalizeMissionSubmission({
  submissionId,
  approverId,
  decision,
  stage
}: FinalizeMissionSubmissionOpts): Promise<ValidationResult> {
  try {
    console.log(`Finalizing submission ${submissionId} with decision ${decision} at stage ${stage}`);
    
    const { data, error } = await supabase.rpc('finalize_submission', {
      p_submission_id: submissionId,
      p_approver_id: approverId,
      p_decision: decision,
      p_stage: stage
    });
    
    if (error) {
      console.error("Error finalizing submission:", error);
      return {
        success: false,
        error: error.message
      };
    }
    
    console.log("Submission finalized successfully:", data);
    
    return {
      success: true,
      data
    };
  } catch (err: any) {
    console.error("Exception finalizing submission:", err);
    return {
      success: false,
      error: err.message || "An unknown error occurred"
    };
  }
}

/**
 * Get mission details by ID
 */
export async function getMissionById(missionId: string): Promise<Mission | null> {
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .eq('id', missionId)
    .single();
  
  if (error) {
    console.error("Error fetching mission:", error);
    return null;
  }
  
  // Return the raw mission data
  return data as Mission;
}

/**
 * Get submission by ID
 */
export async function getSubmissionById(submissionId: string): Promise<MissionSubmission | null> {
  const { data, error } = await supabase
    .from('mission_submissions')
    .select(`
      *,
      missions:mission_id(title),
      user:user_id(id, full_name, avatar_url)
    `)
    .eq('id', submissionId)
    .single();
  
  if (error) {
    console.error("Error fetching submission:", error);
    return null;
  }
  
  if (!data) return null;
  
  // Transform the raw data to match the MissionSubmission interface
  const submission = toSubmission({
    ...data,
    user_name: data.user?.full_name || "Usuário",
    user_avatar: data.user?.avatar_url,
    mission_title: data.missions?.title || "Missão"
  });
  
  return submission;
}

/**
 * Get a list of submissions for a specific mission
 */
export async function getSubmissionsForMission(missionId: string): Promise<MissionSubmission[]> {
  const { data, error } = await supabase
    .from('mission_submissions')
    .select(`
      *,
      missions:mission_id(title),
      user:user_id(id, full_name, avatar_url)
    `)
    .eq('mission_id', missionId)
    .order('submitted_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching submissions:", error);
    return [];
  }
  
  if (!data || data.length === 0) return [];
  
  // Transform the raw data to match the MissionSubmission[] interface
  const submissions: MissionSubmission[] = data.map(item => {
    return toSubmission({
      ...item,
      user_name: item.user?.full_name || "Usuário",
      user_avatar: item.user?.avatar_url,
      mission_title: item.missions?.title || "Missão"
    });
  });
  
  return submissions;
}

/**
 * Get user profile by ID
 */
export async function getUserById(userId: string): Promise<any | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }
  
  return data;
}
