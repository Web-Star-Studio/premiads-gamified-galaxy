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
  const [allMissions, setAllMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [currentFilter, setFilter] = useState(initialFilter);
  const { toast } = useToast();
  const { playSound } = useSounds();

  const fetchMissions = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: userData, error: userError } = await missionService.supabase.auth.getUser();
      console.log('Auth data:', userData);
      console.log('Auth error:', userError);
      
      if (userError || !userData.user) {
        console.error("Erro de autenticação:", userError);
        setError('Usuário não autenticado');
        return;
      }
      
      const userId = userData.user.id;
      console.log('Fetching missions for user:', userId);
      console.log('User email:', userData.user.email);
      console.log('User role:', userData.user.role);
      
      // First, let's check if there are any missions at all
      const { data: allMissionsTest, error: testError } = await missionService.supabase
        .from('missions')
        .select('id, title, status, is_active')
        .limit(5);
      
      console.log('Test query - all missions (first 5):', allMissionsTest);
      console.log('Test query error:', testError);
      
      // Now let's try with the filters
      const { data: filteredMissionsTest, error: filteredTestError } = await missionService.supabase
        .from('missions')
        .select('id, title, status, is_active')
        .eq('is_active', true)
        .eq('status', 'ativa')
        .limit(5);
      
      console.log('Filtered test query:', filteredMissionsTest);
      console.log('Filtered test error:', filteredTestError);
      
      // Test without the join to see if that's the issue
      const { data: missionsWithoutJoin, error: noJoinError } = await missionService.supabase
        .from('missions')
        .select('*')
        .eq('is_active', true)
        .eq('status', 'ativa')
        .order('created_at', { ascending: false });
      
      console.log('Missions without join:', missionsWithoutJoin);
      console.log('No join error:', noJoinError);
      
      // Fetch missions with user submission data
      const { data: missionsData, error: missionsError } = await missionService.supabase
        .from('missions')
        .select('*')
        .eq('is_active', true)
        .eq('status', 'ativa')
        .order('created_at', { ascending: false });
      
      console.log('Raw missions data from database:', missionsData);
      console.log('Missions error:', missionsError);
      
      if (missionsError) throw missionsError;
      
      // If we have missions, fetch user submissions separately
      let userSubmissions: any[] = [];
      if (missionsData && missionsData.length > 0) {
        const missionIds = missionsData.map(m => m.id);
        const { data: submissionsData, error: submissionsError } = await missionService.supabase
          .from('mission_submissions')
          .select('id, mission_id, status, submitted_at, user_id')
          .eq('user_id', userId)
          .in('mission_id', missionIds);
        
        console.log('User submissions:', submissionsData);
        console.log('Submissions error:', submissionsError);
        
        if (!submissionsError) {
          userSubmissions = submissionsData || [];
        }
      }
      
      // Process missions and add user-specific status
      const processedMissions = (missionsData || []).map(missionData => {
        const userSubmission = userSubmissions.find(
          (sub: any) => sub.mission_id === missionData.id
        );
        
        // Map Supabase mission to unified Mission type
        const mission = mapSupabaseMissionToMission(missionData);
        
        // Add user-specific properties
        mission.hasUserSubmission = !!userSubmission;
        
        // Set user-specific status based on submission
        if (userSubmission) {
          switch (userSubmission.status) {
            case 'in_progress':
              mission.status = 'in_progress';
              break;
            case 'pending_approval':
            case 'second_instance_pending':
              mission.status = 'pending_approval';
              break;
            case 'approved':
              mission.status = 'completed';
              break;
            case 'rejected':
              // Rejected missions return to available status
              mission.status = 'available';
              mission.hasUserSubmission = false;
              break;
            default:
              mission.status = 'available';
          }
        } else {
          mission.status = 'available';
        }
        
        return mission;
      });
      
      console.log('Processed missions:', processedMissions);
      setAllMissions(processedMissions);
      setError('');
    } catch (err: any) {
      console.error('Error fetching missions:', err);
      setError(err.message || 'Erro ao carregar missões');
    } finally {
      setLoading(false);
    }
  };

  // Filter missions based on current filter
  const getFilteredMissions = (): Mission[] => {
    switch (currentFilter) {
      case 'available':
        return allMissions.filter(mission => mission.status === 'available');
      case 'in_progress':
        return allMissions.filter(mission => mission.status === 'in_progress');
      case 'pending':
        return allMissions.filter(mission => mission.status === 'pending_approval');
      case 'completed':
        return allMissions.filter(mission => mission.status === 'completed');
      default:
        return allMissions;
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
    missions: getFilteredMissions(),
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
