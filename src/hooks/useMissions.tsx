import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { supabase } from "@/integrations/supabase/client";
import { Mission } from "@/hooks/useMissionsTypes";
import { UseMissionsOptions } from "@/hooks/missions/types";
import { useMissionSubmit } from "@/hooks/missions/useMissionSubmit";

export const useMissions = ({ initialFilter = "available" }: UseMissionsOptions = {}) => {
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [currentFilter, setFilter] = useState<"available" | "in_progress" | "pending" | "completed">(initialFilter);
  const { toast } = useToast();
  const { playSound } = useSounds();
  const { submitMission: submitMissionToServer, submissionLoading } = useMissionSubmit(setMissions);

  // Define filter to status mapping
  const filterToStatus = {
    available: "available",
    in_progress: "in_progress",
    pending: "pending",
    completed: "completed"
  };

  // Mapear status do banco para o frontend
  const mapDbStatusToFrontend = (dbStatus: string): string => {
    switch (dbStatus.toLowerCase()) {
      case 'ativa':
        return 'available';
      case 'pendente':
        return 'pending';
      case 'concluída':
        return 'completed';
      case 'rejeitada':
        return 'rejected';
      case 'em_progresso':
        return 'in_progress';
      default:
        return dbStatus;
    }
  };

  // Fetch missions based on current filter
  const fetchMissions = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData?.session?.user?.id) {
        console.error("No authenticated user found");
        return;
      }
      
      const userId = sessionData.session.user.id;
      
      // First get all active missions
      const { data: missionData, error: missionError } = await supabase
        .from("missions")
        .select("*")
        .eq("is_active", true);
      
      if (missionError) {
        throw missionError;
      }
      
      // Then get user's mission submissions
      const { data: submissionData, error: submissionError } = await supabase
        .from("mission_submissions")
        .select("*")
        .eq("user_id", userId);
      
      if (submissionError) {
        throw submissionError;
      }
      
      // Process missions to determine their status for this user
      const processedMissions = missionData.map((mission) => {
        const userSubmission = submissionData.find(
          (sub) => sub.mission_id === mission.id
        );
        
        // Determine status based on user's submission
        let status: Mission["status"];
        let hasUserSubmission = false;
        
        if (userSubmission) {
          hasUserSubmission = true;
          // Map submission status to frontend status
          switch (userSubmission.status) {
            case 'in_progress':
              status = 'in_progress';
              break;
            case 'pending_approval':
            case 'pending':
              status = 'pending_approval';
              break;
            case 'approved':
            case 'completed':
              status = 'completed';
              break;
            case 'rejected':
              // Se foi rejeitada, volta a ficar disponível
              status = 'available';
              break;
            default:
              status = userSubmission.status as Mission["status"];
          }
        } else {
          // Sem submissão do usuário - verificar se a missão está ativa
          status = mapDbStatusToFrontend(mission.status || 'ativa');
        }
        
        return {
          ...mission,
          status,
          hasUserSubmission, // Adicionar flag para identificar se já foi submetida
        } as Mission & { hasUserSubmission: boolean };
      });
      
      setMissions(processedMissions);
      
      // If a mission was previously selected, update its data
      if (selectedMission) {
        const updatedMission = processedMissions.find(
          (m) => m.id === selectedMission.id
        );
        
        if (updatedMission) {
          setSelectedMission(updatedMission);
        }
      }
      
    } catch (error) {
      console.error("Error fetching missions:", error);
      toast({
        title: "Erro ao carregar missões",
        description: "Não foi possível carregar as missões. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedMission, toast]);

  // Submit a mission
  const submitMission = async (
    missionId: string,
    submissionData: any,
    status: "in_progress" | "pending_approval" = "pending_approval"
  ): Promise<boolean> => {
    try {
      console.log('Submitting mission:', { missionId, submissionData, status });
      
      // Get current user
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData?.session?.user?.id) {
        console.error("No authenticated user found");
        toast({
          title: "Erro ao enviar submissão",
          description: "Usuário não autenticado. Faça login novamente.",
          variant: "destructive",
        });
        return false;
      }
      
      const userId = sessionData.session.user.id;
      
      // Check if user has already submitted this mission
      const { data: existingSubmission, error: checkError } = await supabase
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
      
      // Get mission details for rewards info
      const { data: mission, error: missionError } = await supabase
        .from('missions')
        .select('*')
        .eq('id', missionId)
        .single();

      if (missionError) {
        console.error("Error fetching mission details:", missionError);
        toast({
          title: "Erro ao enviar submissão",
          description: "Não foi possível obter detalhes da missão.",
          variant: "destructive",
        });
        return false;
      }
      
      // Submit the mission
      const { data: submission, error: submitError } = await supabase
        .from('mission_submissions')
        .insert({
          user_id: userId,
          mission_id: missionId,
          submission_data: submissionData,
          status: status,
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (submitError) {
        console.error("Error submitting mission:", submitError);
        toast({
          title: "Erro ao enviar submissão",
          description: submitError.message || "Ocorreu um erro ao enviar sua submissão",
          variant: "destructive",
        });
        return false;
      }
      
      // Play success sound
      playSound("success");
      
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

  // Fetch missions when component mounts or filter changes
  useEffect(() => {
    fetchMissions();
  }, [fetchMissions, currentFilter]);

  // Get missions filtered by current filter
  const getFilteredMissions = useCallback(() => {
    return missions.filter((mission) => {
      switch (currentFilter) {
        case 'available':
          // Missões ativas que o usuário ainda não submeteu
          return (mission.status === 'available' || 
                 mission.status === 'ativa' || 
                 (typeof mission.status === 'string' && mission.status.toLowerCase() === 'ativa'));
        
        case 'in_progress':
          // Missões que o usuário iniciou mas ainda não finalizou
          return mission.status === 'in_progress';
        
        case 'pending':
          // Missões que o usuário submeteu e estão aguardando aprovação
          return mission.status === 'pending_approval' || mission.status === 'pending';
        
        case 'completed':
          // Missões que foram aprovadas/concluídas para o usuário
          return mission.status === 'approved' || mission.status === 'completed';
        
        default:
          return false;
      }
    });
  }, [missions, currentFilter]);

  // Submit a mission with specific status
  const handleSubmitMission = async (
    missionId: string, 
    submissionData: any, 
    status: "in_progress" | "pending_approval" = "pending_approval"
  ) => {
    const success = await submitMission(missionId, submissionData, status);
    
    if (success) {
      playSound("success");
      
      // Refresh missions after submission
      fetchMissions();
    }
    
    return success;
  };

  return {
    loading,
    missions: getFilteredMissions(),
    allMissions: missions,
    selectedMission,
    setSelectedMission,
    currentFilter,
    setFilter,
    submitMission: handleSubmitMission,
    submissionLoading,
    refreshMissions: fetchMissions
  };
};
