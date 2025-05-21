
import { supabase } from "@/integrations/supabase/client";

interface SubmissionDecisionParams {
  submissionId: string;
  approverId: string;
  decision: "approve" | "reject";
  stage: "advertiser_first" | "admin" | "advertiser_second";
  feedback?: string;
}

export const finalizeMissionSubmission = async ({
  submissionId,
  approverId,
  decision,
  stage,
  feedback
}: SubmissionDecisionParams) => {
  try {
    if (!submissionId) {
      throw new Error("ID da submissão é obrigatório");
    }
    
    if (!approverId) {
      throw new Error("ID do aprovador é obrigatório");
    }
    
    console.log(`Finalizing submission: ${submissionId} with decision: ${decision} at stage: ${stage}`);
    
    // First, update the feedback if provided
    if (feedback) {
      const { error: feedbackError } = await supabase
        .from("mission_submissions")
        .update({ feedback })
        .eq("id", submissionId);
        
      if (feedbackError) {
        console.error("Error updating feedback:", feedbackError);
      }
    }
    
    // Call the finalize_submission function to process the submission
    const { data, error } = await supabase.rpc("finalize_submission", {
      p_submission_id: submissionId,
      p_approver_id: approverId,
      p_decision: decision,
      p_stage: stage
    });
    
    if (error) {
      throw error;
    }
    
    // Process the result
    console.log("Finalize submission result:", data);
    
    return { 
      success: true, 
      status: data.status,
      rewardDetails: {
        badgeEarned: data.badge_earned,
        badgeId: data.badge_id,
        badgeImageUrl: data.badge_image_url,
        lootBoxReward: data.loot_box_reward,
        lootBoxAmount: data.loot_box_amount,
        lootBoxDisplayName: data.loot_box_display_name,
        lootBoxDescription: data.loot_box_description,
        streakBonus: data.streak_bonus,
        currentStreak: data.current_streak
      }
    };
  } catch (error: any) {
    console.error("Error finalizing submission:", error);
    return { 
      success: false, 
      error: error.message || "Erro ao finalizar submissão" 
    };
  }
};
