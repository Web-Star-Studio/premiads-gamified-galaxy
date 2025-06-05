import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { supabase } from "@/integrations/supabase/client";
import { Mission } from "./types";

export const useMissionSubmit = (setMissions: React.Dispatch<React.SetStateAction<Mission[]>>) => {
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const { toast } = useToast();
  const { playSound } = useSounds();

  const submitMission = async (
    missionId: string,
    submissionData: any,
    status: "in_progress" | "pending_approval" = "pending_approval"
  ): Promise<boolean> => {
    setSubmissionLoading(true);

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !sessionData?.session?.user?.id) {
        throw new Error("Usuário não autenticado");
      }

      const userId = sessionData.session.user.id;

      // Get mission details
      const { data: missionData, error: missionError } = await supabase
        .from("missions")
        .select("*")
        .eq("id", missionId)
        .single();

      if (missionError || !missionData) {
        throw new Error("Missão não encontrada");
      }

      // Check if submission, participation, or reward already exists
      const [submissionRes, participationRes, rewardRes] = await Promise.all([
        supabase
          .from("mission_submissions")
          .select("id")
          .eq("mission_id", missionId)
          .eq("user_id", userId)
          .maybeSingle(),
        supabase
          .from("participations")
          .select("id")
          .eq("campaign_id", missionId)
          .eq("user_id", userId)
          .maybeSingle(),
        supabase
          .from("mission_rewards")
          .select("id")
          .eq("mission_id", missionId)
          .eq("user_id", userId)
          .maybeSingle(),
      ]);

      if ((submissionRes.data && submissionRes.data.id) ||
          (participationRes.data && participationRes.data.id) ||
          (rewardRes.data && rewardRes.data.id)) {
        throw new Error("Você já participou desta missão");
      }

      // Create new submission
      const { data: newSubmission, error: submissionError } = await supabase
        .from("mission_submissions")
        .insert({
          mission_id: missionId,
          user_id: userId,
          submission_data: submissionData,
          status: status,
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (submissionError) {
        throw submissionError;
      }

      // Update missions list to reflect new status
      setMissions((prevMissions: Mission[]) =>
        prevMissions.map((mission) =>
          mission.id === missionId
            ? { ...mission, status: status === "pending_approval" ? "pending_approval" : "in_progress" }
            : mission
        )
      );

      // Calculate rewards based on mission data
      const ticketsEarned = missionData.tickets_reward || 0;
      const cashbackEarned = missionData.cashback_reward || 0;

      toast({
        title: "Missão enviada!",
        description: `Sua submissão foi enviada para análise. Você receberá ${ticketsEarned} tickets e R$ ${cashbackEarned.toFixed(2)} em cashback após aprovação.`,
      });

      return true;
    } catch (error: any) {
      console.error("Error submitting mission:", error);
      toast({
        title: "Erro ao enviar missão",
        description: error.message || "Ocorreu um erro ao enviar sua missão",
        variant: "destructive",
      });
      playSound("error");
      return false;
    } finally {
      setSubmissionLoading(false);
    }
  };

  return { submitMission, submissionLoading };
};
