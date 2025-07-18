
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Mission, mapSupabaseMissionToMission } from '@/types/mission-unified';

interface UseMissionsFetchProps {
  status?: string;
  advertiserId?: string;
}

export const useMissionsFetch = ({ status, advertiserId }: UseMissionsFetchProps = {}) => {
  const {
    data: missions = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['missions', 'fetch', status, advertiserId],
    queryFn: async (): Promise<Mission[]> => {
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
      return mappedMissions;
    },
    staleTime: 1000 * 60 * 3, // 3 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    retry: 3
  });

  return {
    missions,
    loading,
    error: error?.message || null,
    refetch
  };
};
