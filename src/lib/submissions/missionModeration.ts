
import { supabase } from "@/integrations/supabase/client";

export type ValidationStage = "advertiser_first" | "admin" | "advertiser_second";

interface SubmissionDecisionParams {
  submissionId: string;
  approverId: string;
  decision: "approve" | "reject";
  stage: ValidationStage;
  feedback?: string;
}

interface FinalizationResult {
  status: string;
  badge_earned: boolean;
  badge_id: string;
  badge_image_url: string;
  loot_box_reward: string;
  loot_box_amount: number;
  loot_box_display_name: string;
  loot_box_description: string;
  streak_bonus: number;
  current_streak: number;
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
    
    const typedData = data as FinalizationResult;
    
    return { 
      success: true, 
      status: typedData.status,
      rewardDetails: {
        badgeEarned: typedData.badge_earned,
        badgeId: typedData.badge_id,
        badgeImageUrl: typedData.badge_image_url,
        lootBoxReward: typedData.loot_box_reward,
        lootBoxAmount: typedData.loot_box_amount,
        lootBoxDisplayName: typedData.loot_box_display_name,
        lootBoxDescription: typedData.loot_box_description,
        streakBonus: typedData.streak_bonus,
        currentStreak: typedData.current_streak
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
