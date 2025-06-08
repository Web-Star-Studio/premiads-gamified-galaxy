
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
}

export const useMissions = (): UseMissionsReturn => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

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

  useEffect(() => {
    fetchMissions();
  }, []);

  return {
    missions,
    loading,
    error,
    selectedMission,
    setSelectedMission,
    refetch: fetchMissions
  };
};

// Export Mission type for other components
export { Mission };
