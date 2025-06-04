
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryKeys } from '@/lib/query-client';
import { useAuthStore } from '@/stores/authStore';
import { Mission } from '@/hooks/missions/types';

export const useMissions = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const missionsQuery = useQuery({
    queryKey: queryKeys.userMissions(user?.id || ''),
    queryFn: async (): Promise<Mission[]> => {
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes for missions
  });

  const participateMutation = useMutation({
    mutationFn: async ({ missionId, submissionData }: { missionId: string; submissionData: any }) => {
      const { data, error } = await supabase
        .from('mission_submissions')
        .insert({
          mission_id: missionId,
          user_id: user?.id,
          submission_data: submissionData,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate missions to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.missions() });
    }
  });

  return {
    missions: missionsQuery.data || [],
    isLoading: missionsQuery.isLoading,
    error: missionsQuery.error,
    participate: participateMutation.mutateAsync,
    isParticipating: participateMutation.isPending
  };
};
