
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { MissionSubmission } from "@/types/missions";
import { useQueryClient } from "@tanstack/react-query";
import { finalizeMissionSubmission, ValidationStage } from "@/lib/submissions/missionModeration";
import { useRewardAnimations, RewardDetails } from "@/utils/rewardAnimations";
import { 
  getBadgeAnimationForMissionType, 
  generateBadgeDescription, 
  generateBadgeName,
  isLottieAnimation
} from '@/utils/getBadgeAnimation';

interface UseSubmissionActionsProps {
  onRemove: (submissionId: string) => void;
}

export const useSubmissionActions = ({ onRemove }: UseSubmissionActionsProps) => {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const { playSound } = useSounds();
  const queryClient = useQueryClient();
  const { showRewardNotification } = useRewardAnimations();
  
  /**
   * Handle submission approval and reward distribution
   * @param submission - The submission to approve
   */
  const handleApprove = async (submission: MissionSubmission) => {
    setProcessing(true);
    
    try {
      const { data: { user: approverUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !approverUser) {
        throw new Error(authError?.message || "Aprovador não autenticado.");
      }

      // Determine the stage based on submission state
      const stage: ValidationStage = submission.second_instance ? 'advertiser_second' : 'advertiser_first';
      console.log(`Approving submission ${submission.id} with stage ${stage}`);

      // Approve the submission - process_mission_rewards is now called internally
      const result = await finalizeMissionSubmission({
        submissionId: submission.id,
        approverId: approverUser.id,
        decision: 'approve',
        stage 
      });

      if (!result.success || result.error) {
        throw new Error(result.error || "Falha ao finalizar a submissão via RPC.");
      }

      console.log("Submission approved successfully, result:", result);
      
      // Extract reward details from the result for notification
      let rewardInfo = "";
      const rewardDetails = result.rewardDetails;
      
      // Prepare reward details for notification
      const rewardDetailsForAnimation: RewardDetails = {
        points: 0,
      };
      
      if (rewardDetails) {
        console.log("Reward result details:", rewardDetails);
        
        if (rewardDetails.badgeEarned) {
          rewardInfo += " Badge concedido!";
          rewardDetailsForAnimation.badge_earned = true;
          rewardDetailsForAnimation.badge_name = submission.mission_title;
          
          // Create or update badge record with proper image URL and description
          const { data: missionInfo } = await supabase
            .from('missions')
            .select('has_badge, type, title, badge_image_url')
            .eq('id', submission.mission_id)
            .single();
            
          if (missionInfo?.has_badge) {
            const badgeName = generateBadgeName(missionInfo.title);
            const badgeDescription = generateBadgeDescription(missionInfo.title);
            
            // Use the mission's badge_image_url if it exists, otherwise generate one based on mission type
            let badgeImageUrl = missionInfo.badge_image_url;
            if (!badgeImageUrl) {
              badgeImageUrl = getBadgeAnimationForMissionType(missionInfo.type);
            }
            
            console.log(`Creating/updating badge with image URL: ${badgeImageUrl}`);
            
            const { data: existingBadge } = await supabase
              .from('user_badges')
              .select('id, badge_image_url')
              .eq('user_id', submission.user_id)
              .eq('mission_id', submission.mission_id)
              .single();
            
            if (!existingBadge) {
              await supabase.from('user_badges').insert({
                user_id: submission.user_id,
                mission_id: submission.mission_id,
                badge_name: badgeName,
                badge_description: badgeDescription,
                badge_image_url: badgeImageUrl,
                earned_at: new Date().toISOString()
              });
              console.log("Created new badge record");
            } else if (!existingBadge.badge_image_url || isLottieAnimation(existingBadge.badge_image_url)) {
              // Update if badge exists but has no image or is using Lottie (which might be blocked)
              await supabase.from('user_badges').update({
                badge_name: badgeName,
                badge_description: badgeDescription,
                badge_image_url: badgeImageUrl
              }).eq('id', existingBadge.id);
              console.log("Updated existing badge record");
            }
            
            // Force refresh badge data
            queryClient.invalidateQueries({ queryKey: ['user_badges'] });
          }
        }
        
        if (rewardDetails.lootBoxReward) {
          rewardInfo += ` Loot box: ${rewardDetails.lootBoxReward} (${rewardDetails.lootBoxAmount})!`;
          rewardDetailsForAnimation.loot_box_reward = rewardDetails.lootBoxReward;
          rewardDetailsForAnimation.loot_box_amount = rewardDetails.lootBoxAmount;
        }
        
        if (rewardDetails.streakBonus > 0) {
          rewardInfo += ` Bônus de sequência: +${rewardDetails.streakBonus} pontos!`;
          rewardDetailsForAnimation.streak_bonus = rewardDetails.streakBonus;
          rewardDetailsForAnimation.current_streak = rewardDetails.currentStreak;
        }
        
        // Display reward animation if there are special rewards
        if (rewardDetails.badgeEarned || rewardDetails.lootBoxReward || rewardDetails.streakBonus > 0) {
          console.log("Showing reward notification with details:", rewardDetailsForAnimation);
          showRewardNotification(rewardDetailsForAnimation);
        }
      }
      
      // Fetch mission title for the toast message
      let missionTitle = "esta missão"; 
      if (submission.mission_id) {
        const { data: missionDetails } = await supabase
          .from("missions")
          .select("title")
          .eq("id", submission.mission_id)
          .single();
        if (missionDetails) {
          missionTitle = `"${missionDetails.title}"`;
        }
      }
      
      playSound("reward");
      toast({
        title: "Submissão aprovada",
        description: `Submissão de ${submission.user_name || 'usuário'} foi aprovada com sucesso!${rewardInfo}`,
      });
      
      // Invalidate queries to ensure UI updates
      queryClient.invalidateQueries({ queryKey: ['mission_submissions'] });
      queryClient.invalidateQueries({ queryKey: ['user_badges'] });
      queryClient.invalidateQueries({ queryKey: ['loot_box_rewards'] });
      queryClient.invalidateQueries({ queryKey: ['recentRewards'] });
      queryClient.invalidateQueries({ queryKey: ['daily_streaks'] });
      
      onRemove(submission.id);
    } catch (error: any) {
      console.error("Error approving submission:", error);
      toast({
        title: "Erro na aprovação",
        description: error.message || "Ocorreu um erro ao aprovar a submissão",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };
  
  /**
   * Handle submission rejection
   * @param submission - The submission to reject
   * @param reason - Optional reason for rejection
   */
  const handleReject = async (submission: MissionSubmission, reason?: string) => {
    setProcessing(true);
    
    try {
      const { data: { user: rejectorUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !rejectorUser) {
        throw new Error(authError?.message || "Usuário aprovador não autenticado.");
      }

      // Determine the stage based on submission state
      const stage: ValidationStage = submission.second_instance ? 'advertiser_second' : 'advertiser_first';
      console.log(`Rejecting submission ${submission.id} with stage ${stage}`);

      const result = await finalizeMissionSubmission({
        submissionId: submission.id,
        approverId: rejectorUser.id,
        decision: 'reject',
        stage
      });

      if (!result.success || result.error) {
        throw new Error(result.error || "Falha ao rejeitar a submissão via RPC.");
      }

      // Optional: Update feedback if provided
      if (reason) {
        await supabase
          .from("mission_submissions")
          .update({ feedback: reason })
          .eq("id", submission.id);
      }

      // Fetch mission title for the toast message
      let missionTitle = "esta missão";
      if (submission.mission_id) {
        const { data: missionDetails } = await supabase
          .from("missions")
          .select("title")
          .eq("id", submission.mission_id)
          .single();
        if (missionDetails) {
          missionTitle = `"${missionDetails.title}"`;
        }
      }
      
      playSound("error");
      toast({
        title: "Submissão rejeitada",
        description: `Submissão de ${submission.user_name || 'usuário'} foi rejeitada.`,
      });
      
      // Invalidate queries to ensure UI updates
      queryClient.invalidateQueries({ queryKey: ['mission_submissions'] });
      
      onRemove(submission.id);
    } catch (error: any) {
      console.error("Error rejecting submission:", error);
      toast({
        title: "Erro na rejeição",
        description: error.message || "Ocorreu um erro ao rejeitar a submissão",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return {
    processing,
    handleApprove,
    handleReject
  };
};
