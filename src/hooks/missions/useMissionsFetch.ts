
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Mission, mapSupabaseMissionToMission } from '@/types/mission-unified';

interface UseMissionsFetchProps {
  status?: string;
  advertiserId?: string;
}

export const useMissionsFetch = ({ status, advertiserId }: UseMissionsFetchProps = {}) => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      if (advertiserId) {
        query = query.eq('advertiser_id', advertiserId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      // Mapear dados do Supabase para o formato Mission
      const mappedMissions = (data || []).map(mapSupabaseMissionToMission);
      setMissions(mappedMissions);
    } catch (err: any) {
      console.error('Error fetching missions:', err);
      setError(err.message);
      setMissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, [status, advertiserId]);

  return {
    missions,
    loading,
    error,
    refetch: fetchMissions
  };
};
