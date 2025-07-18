
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Submission {
  id: string;
  mission_id: string;
  user_id: string;
  submission_data: any;
  status: string;
  submitted_at: string;
  validated_by?: string;
  admin_validated: boolean;
  second_instance: boolean;
  review_stage: string;
  second_instance_status?: string;
  updated_at: string;
}

interface UseSubmissionsProps {
  missionId?: string;
  userId?: string;
  status?: string;
}

export const useSubmissions = ({ missionId, userId, status }: UseSubmissionsProps = {}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query para buscar submissões
  const {
    data: submissions = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['submissions', missionId, userId, status],
    queryFn: async (): Promise<Submission[]> => {
      let query = supabase
        .from('mission_submissions')
        .select(`
          id,
          mission_id,
          user_id,
          submission_data,
          status,
          submitted_at,
          validated_by,
          admin_validated,
          second_instance,
          review_stage,
          second_instance_status,
          updated_at
        `)
        .order('submitted_at', { ascending: false });

      if (missionId) {
        query = query.eq('mission_id', missionId);
      }

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      return data || [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    retry: 3
  });

  // Mutation para submeter missão
  const submitMissionMutation = useMutation({
    mutationFn: async ({
      missionId,
      submissionData
    }: {
      missionId: string;
      submissionData: any;
    }) => {
      const { data, error } = await supabase
        .from('mission_submissions')
        .insert({
          mission_id: missionId,
          submission_data: submissionData,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: 'Sucesso',
        description: 'Submissão enviada com sucesso!'
      });

      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      queryClient.invalidateQueries({ queryKey: ['missions'] });
    },
    onError: (error: any) => {
      console.error('Error submitting mission:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao enviar submissão',
        variant: 'destructive'
      });
    }
  });

  // Handle query errors
  if (error) {
    console.error('Error fetching submissions:', error);
    toast({
      title: 'Erro ao carregar submissões',
      description: error.message,
      variant: 'destructive',
    });
  }

  const submitMission = async (missionId: string, submissionData: any) => {
    try {
      const result = await submitMissionMutation.mutateAsync({
        missionId,
        submissionData
      });
      return { success: true, submission: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return {
    submissions,
    loading,
    error: error?.message || null,
    refetch,
    submitMission,
    isSubmitting: submitMissionMutation.isPending
  };
};
