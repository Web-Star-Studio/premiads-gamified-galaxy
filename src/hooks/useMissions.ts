import { useState, useEffect } from 'react';
import { Mission, mapSupabaseMissionToMission } from '@/types/mission-unified';
import { missionService } from '@/services/supabase';

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
      // Aqui você chamaria o service para submeter a missão
      console.log('Submitting mission:', { missionId, submissionData, status });
      // Exemplo: await missionService.createSubmission({ mission_id: missionId, ... });
      return true;
    } catch (error) {
      console.error("Error submitting mission:", error);
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
