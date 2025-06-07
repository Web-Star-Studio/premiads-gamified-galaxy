
import { useState, useEffect } from 'react';
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
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);

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

      setSubmissions(data || []);
    } catch (err: any) {
      console.error('Error fetching submissions:', err);
      setError(err.message);
      toast({
        title: 'Erro ao carregar submissões',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const submitMission = async (missionId: string, submissionData: any) => {
    try {
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

      toast({
        title: 'Sucesso',
        description: 'Submissão enviada com sucesso!'
      });

      await fetchSubmissions();
      return { success: true, submission: data };
    } catch (error: any) {
      console.error('Error submitting mission:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao enviar submissão',
        variant: 'destructive'
      });
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [missionId, userId, status]);

  return {
    submissions,
    loading,
    error,
    refetch: fetchSubmissions,
    submitMission,
    isSubmitting: false
  };
};
