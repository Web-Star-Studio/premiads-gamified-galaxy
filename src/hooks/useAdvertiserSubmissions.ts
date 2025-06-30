
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAdvertiserSubmissions = () => {
  const [submissions, setSubmissions] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Get missions created by this advertiser
        const { data: missions, error: missionsError } = await supabase
          .from('missions')
          .select('id')
          .eq('advertiser_id', user.id);

        if (missionsError) throw missionsError;

        if (!missions || missions.length === 0) {
          setSubmissions(0);
          setLoading(false);
          return;
        }

        const missionIds = missions.map(m => m.id);

        // Count pending submissions for these missions
        const { count, error: submissionsError } = await supabase
          .from('mission_submissions')
          .select('*', { count: 'exact', head: true })
          .in('mission_id', missionIds)
          .eq('status', 'pending_approval');

        if (submissionsError) throw submissionsError;

        setSubmissions(count || 0);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  return {
    submissions,
    loading,
    error,
  };
};
