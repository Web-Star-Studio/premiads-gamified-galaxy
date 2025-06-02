import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { supabase } from "@/integrations/supabase/client";
import { Mission } from "./types";
import { useRewardAnimations, RewardDetails } from "@/utils/rewardAnimations";

export const useMissionSubmit = (setMissions: React.Dispatch<React.SetStateAction<Mission[]>>) => {
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const { toast } = useToast();
  const { playSound } = useSounds();
  const { showRewardNotification } = useRewardAnimations();

  /**
   * Submit a mission with evidence and optional attachments
   * @param missionId - The ID of the mission
   * @param submissionData - The submission data including content and files
   * @param status - The status to set the mission to (in_progress or pending_approval)
   * @returns Boolean indicating success
   */
  const submitMission = async (
    missionId: string, 
    submissionData: any,
    status: "in_progress" | "pending_approval" = "pending_approval"
  ) => {
    setSubmissionLoading(true);
    
    try {
      console.log("Submitting mission:", { missionId, submissionData, status });
      
      // Check if user is authenticated
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData?.session?.user?.id) {
        throw new Error("Usuário não autenticado");
      }
      
      const userId = sessionData.session.user.id;
      
      // Check if this user already has a submission for this mission
      const { data: existingSubmission, error: checkError } = await supabase
        .from("mission_submissions")
        .select("id, status")
        .eq("mission_id", missionId)
        .eq("user_id", userId)
        .maybeSingle();
      
      if (checkError) {
        console.error("Error checking existing submission:", checkError);
        throw checkError;
      }
      
      // Upload files if present
      const fileUrls: string[] = [];
      if (submissionData.files && submissionData.files.length > 0) {
        // Upload each file to Supabase Storage
        for (const file of submissionData.files) {
          if (!(file instanceof File)) continue;
          
          const fileName = `${userId}/${missionId}/${Date.now()}_${file.name}`;
          const { data: fileData, error: uploadError } = await supabase.storage
            .from('mission-submissions')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false
            });
          
          if (uploadError) {
            console.error("Error uploading file:", uploadError);
            continue;
          }
          
          // Get the public URL for the file
          const { data: publicUrlData } = supabase.storage
            .from('mission-submissions')
            .getPublicUrl(fileData.path);
            
          fileUrls.push(publicUrlData.publicUrl);
        }
      }
      
      // Prepare final submission data with uploads
      const finalSubmissionData = {
        content: submissionData.content,
        fileUrls,
        ...submissionData,
        submittedAt: new Date().toISOString()
      };

      // Map UI status to database status
      const dbStatus = status === "in_progress" ? "in_progress" : "pending";

      // For logging purposes
      console.log(`Enviando submissão para missão ${missionId} com status: ${dbStatus}`);

      // Update or create submission record
      let result;
      let submissionId;
      
      // If a submission already exists, update it
      if (existingSubmission) {
        console.log("Updating existing submission:", existingSubmission.id);
        submissionId = existingSubmission.id;
        
        result = await supabase
          .from("mission_submissions")
          .update({
            submission_data: finalSubmissionData,
            status: dbStatus,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingSubmission.id);
      } else {
        // Otherwise, create a new submission
        console.log("Creating new submission");
        
        const insertResult = await supabase
          .from("mission_submissions")
          .insert({
            mission_id: missionId,
            user_id: userId,
            submission_data: finalSubmissionData,
            status: dbStatus,
            submitted_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select();
          
        result = insertResult;
        
        if (insertResult.data && insertResult.data.length > 0) {
          submissionId = insertResult.data[0].id;
        }
      }
      
      if (result.error) {
        console.error("Error submitting mission:", result.error);
        toast({
          title: "Erro ao enviar missão",
          description: result.error.message || "Ocorreu um erro ao enviar sua missão",
          variant: "destructive",
        });
        return false;
      }
      
      console.log("Mission submitted successfully");
      
      // Process rewards if the submission is being submitted for approval
      if (status === "pending_approval" && submissionId) {
        try {
          // Get mission details for reward processing
          const { data: missionData } = await supabase
            .from("missions")
            .select("*")
            .eq("id", missionId)
            .single();
            
          // Show appropriate notification
          if (missionData) {
            console.log("Mission reward details:", {
              points: missionData.points,
              has_badge: missionData.has_badge,
              has_lootbox: missionData.has_lootbox,
              title: missionData.title
            });
            
            const rewardDetails: RewardDetails = {
              points: missionData.points || 0,
              badge_earned: missionData.has_badge,
              badge_name: missionData.title,
              loot_box_reward: missionData.has_lootbox ? 'pending' : undefined
            };
            
            showRewardNotification(rewardDetails);
          } else {
            playSound("success");
          }
        } catch (rewardError) {
          console.error("Error processing rewards:", rewardError);
          playSound("success");
        }
      } else {
        // Play sound based on status
        playSound(status === "pending_approval" ? "success" : "pop");
      }
      
      // Update missions in state
      setMissions(prevMissions => prevMissions.map(mission => {
        if (mission.id === missionId) {
          return {
            ...mission,
            status: status === "in_progress" ? "in_progress" : "pending_approval",
          };
        }
        return mission;
      }));
      
      toast({
        title: "Missão enviada com sucesso",
        description: status === "in_progress" 
          ? "A missão foi salva e está em progresso" 
          : "Sua missão foi enviada e está aguardando aprovação",
      });
      
      return true;
    } catch (error: any) {
      console.error("Error submitting mission:", error);
      toast({
        title: "Erro ao enviar missão",
        description: error.message || "Ocorreu um erro ao enviar sua missão",
        variant: "destructive",
      });
      return false;
    } finally {
      setSubmissionLoading(false);
    }
  };

  return { submitMission, submissionLoading };
};
