import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSounds } from '@/hooks/use-sounds';
import { useRewardAnimations } from '@/utils/rewardAnimations';

interface SubmissionData {
  [key: string]: any;
}

export const useMissionSubmit = (setMissions?: React.Dispatch<React.SetStateAction<any[]>>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { playSound } = useSounds();
  const { showRewardNotification } = useRewardAnimations();

  const submitMission = async (missionId: string, submissionData: SubmissionData, status: "in_progress" | "pending_approval" = "pending_approval") => {
    setIsSubmitting(true);
    
    try {
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error('Usuário não autenticado');
      }

      const userId = userData.user.id;

      // Check if user has already submitted this mission
      const { data: existingSubmission, error: checkError } = await supabase
        .from('mission_submissions')
        .select('id')
        .eq('user_id', userId)
        .eq('mission_id', missionId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingSubmission) {
        throw new Error('Você já enviou uma submissão para esta missão');
      }

      // Get mission details
      const { data: mission, error: missionError } = await supabase
        .from('missions')
        .select('*')
        .eq('id', missionId)
        .single();

      if (missionError) throw missionError;
      if (!mission) throw new Error('Missão não encontrada');

      console.log('Enviando submissão com status:', status);
      console.log('Dados da submissão:', submissionData);

      // Submit the mission
      const { data: submission, error: submitError } = await supabase
        .from('mission_submissions')
        .insert({
          user_id: userId,
          mission_id: missionId,
          submission_data: submissionData,
          status: status,
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          review_stage: 'first_review'
        })
        .select()
        .single();

      if (submitError) {
        console.error('Erro ao enviar submissão:', submitError);
        throw submitError;
      }

      console.log('Submissão enviada com sucesso:', submission);

      // Play success sound
      playSound('success');

      // Show success toast with mission rewards info
      const rewardsText = mission.rifas > 0 ? `${mission.rifas} rifas` : '';
      const cashbackText = mission.cashback_reward > 0 ? `R$ ${mission.cashback_reward}` : '';
      const rewardsInfo = [rewardsText, cashbackText].filter(Boolean).join(' + ');

      toast({
        title: "Submissão enviada com sucesso!",
        description: rewardsInfo ? `Quando aprovada, você receberá: ${rewardsInfo}` : "Sua submissão está sendo analisada.",
        variant: "default",
        className: "bg-gradient-to-br from-green-600/90 to-teal-500/60 text-white border-neon-cyan"
      });

      // Atualizar a lista de missões se a função setMissions for fornecida
      if (setMissions) {
        // Atualizar o status da missão na lista local
        setMissions(prevMissions => 
          prevMissions.map(m => 
            m.id === missionId 
              ? { ...m, status: status } 
              : m
          )
        );
      }

      return { success: true, submission };
    } catch (error: any) {
      console.error('Error submitting mission:', error);
      
      toast({
        title: "Erro ao enviar submissão",
        description: error.message || "Ocorreu um erro ao enviar sua submissão",
        variant: "destructive"
      });

      playSound('error');
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitMission,
    isSubmitting
  };
};
