
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
  // First get the submission
  const { data: submissionData, error: submissionError } = await supabase
    .from('mission_submissions')
    .select('*')
    .eq('id', submissionId)
    .single();
  
  if (submissionError) {
    console.error("Error fetching submission:", submissionError);
    return null;
  }
  
  if (!submissionData) return null;
  
  // Then get mission title
  const { data: missionData } = await supabase
    .from('missions')
    .select('title')
    .eq('id', submissionData.mission_id)
    .single();
    
  // Then get user data
  const { data: userData } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', submissionData.user_id)
    .single();
  
  // Transform the data to match the MissionSubmission interface
  const submission = toSubmission({
    ...submissionData,
    user_name: userData?.full_name || "Usuário",
    user_avatar: userData?.avatar_url,
    mission_title: missionData?.title || "Missão",
    user: {
      name: userData?.full_name || "Usuário",
      id: submissionData.user_id,
      avatar_url: userData?.avatar_url
    },
    missions: {
      title: missionData?.title || "Missão"
    }
  });
  
  return submission;
}

/**
 * Get a list of submissions for a specific mission
 */
export async function getSubmissionsForMission(missionId: string): Promise<MissionSubmission[]> {
  // Get submissions
  const { data: submissionsData, error: submissionsError } = await supabase
    .from('mission_submissions')
    .select('*')
    .eq('mission_id', missionId)
    .order('submitted_at', { ascending: false });
  
  if (submissionsError) {
    console.error("Error fetching submissions:", submissionsError);
    return [];
  }
  
  if (!submissionsData || submissionsData.length === 0) return [];
  
  // Get mission title
  const { data: missionData } = await supabase
    .from('missions')
    .select('title')
    .eq('id', missionId)
    .single();
    
  // Get user profiles for all users
  const userIds = [...new Set(submissionsData.map(sub => sub.user_id))];
  const { data: profilesData } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .in('id', userIds);
    
  const userProfiles = (profilesData || []).reduce((acc, profile) => {
    acc[profile.id] = profile;
    return acc;
  }, {} as Record<string, any>);
  
  // Transform the data
  const submissions: MissionSubmission[] = submissionsData.map(item => {
    const userProfile = userProfiles[item.user_id] || {};
    
    return toSubmission({
      ...item,
      user_name: userProfile.full_name || "Usuário",
      user_avatar: userProfile.avatar_url,
      mission_title: missionData?.title || "Missão",
      user: {
        name: userProfile.full_name || "Usuário",
        id: item.user_id,
        avatar_url: userProfile.avatar_url
      },
      missions: {
        title: missionData?.title || "Missão"
      }
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
