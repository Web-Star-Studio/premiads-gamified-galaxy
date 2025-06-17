import { useState, useEffect } from 'react';
import { Mission, mapSupabaseMissionToMission } from '@/types/mission-unified';
import { missionService } from '@/services/supabase';
import { useToast } from '@/hooks/use-toast';
import { useSounds } from '@/hooks/use-sounds';

export interface SubmissionData {
  mission_id: string;
  submission_data: any;
}

interface UseMissionsReturn {
  missions: Mission[];
  loading: boolean;
  error: string;
  selectedMission: Mission | null;
  setSelectedMission: (mission: Mission | null) => void;
  refetch: () => Promise<void>;
  currentFilter: string;
  setFilter: (filter: string) => void;
  submitMission: (missionId: string, submissionData: any, status: "in_progress" | "pending_approval") => Promise<boolean>;
}

export const useMissions = ({ initialFilter = 'available' }): UseMissionsReturn => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [currentFilter, setFilter] = useState(initialFilter);
  const { toast } = useToast();
  const { playSound } = useSounds();

  const fetchMissions = async () => {
    try {
      setLoading(true);
      const data = await missionService.getMissions('ativa');
      const mappedMissions = data.map(mapSupabaseMissionToMission);
      setMissions(mappedMissions);
      setError('');
    } catch (err: any) {
      console.error('Error fetching missions:', err);
      setError(err.message || 'Erro ao carregar missões');
    } finally {
      setLoading(false);
    }
  };

  const submitMission = async (
    missionId: string,
    submissionData: any,
    status: "in_progress" | "pending_approval"
  ): Promise<boolean> => {
    try {
      console.log('Submitting mission:', { missionId, submissionData, status });
      
      // Get current user from Supabase
      const { data: userData, error: userError } = await missionService.supabase.auth.getUser();
      if (userError || !userData.user) {
        console.error("Erro de autenticação:", userError);
        toast({
          title: "Erro ao enviar submissão",
          description: "Usuário não autenticado. Faça login novamente.",
          variant: "destructive",
        });
        return false;
      }
      
      const userId = userData.user.id;
      
      // Check if user has already submitted this mission
      const { data: existingSubmission, error: checkError } = await missionService.supabase
        .from('mission_submissions')
        .select('id')
        .eq('user_id', userId)
        .eq('mission_id', missionId)
        .single();

      if (existingSubmission) {
        toast({
          title: "Submissão já enviada",
          description: "Você já enviou uma submissão para esta missão.",
          variant: "destructive",
        });
        return false;
      }
      
      // Create submission in database
      const submission = {
        user_id: userId,
        mission_id: missionId,
        submission_data: submissionData,
        status: status,
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        review_stage: 'first_review'
      };
      
      console.log('Enviando submissão para o banco de dados:', submission);
      
      const { data, error: submitError } = await missionService.supabase
        .from('mission_submissions')
        .insert(submission)
        .select()
        .single();
        
      if (submitError) {
        console.error("Erro ao enviar submissão:", submitError);
        toast({
          title: "Erro ao enviar submissão",
          description: submitError.message || "Ocorreu um erro ao enviar sua submissão",
          variant: "destructive",
        });
        return false;
      }
      
      console.log('Submissão criada com sucesso:', data);
      
      // Get mission details for rewards info
      const { data: mission, error: missionError } = await missionService.supabase
        .from('missions')
        .select('*')
        .eq('id', missionId)
        .single();

      if (!missionError && mission) {
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
      } else {
        toast({
          title: "Submissão enviada com sucesso!",
          description: "Sua submissão está sendo analisada.",
          variant: "default",
        });
      }
      
      // Play success sound
      playSound("success");
      
      // Refresh missions to update status
      fetchMissions();
      
      return true;
    } catch (error: any) {
      console.error("Error submitting mission:", error);
      toast({
        title: "Erro ao enviar submissão",
        description: error.message || "Ocorreu um erro ao enviar sua submissão",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  return {
    missions,
    loading,
    error,
    selectedMission,
    setSelectedMission,
    refetch: fetchMissions,
    currentFilter,
    setFilter,
    submitMission
  };
};

// Export Mission type for other components
// export { Mission };
