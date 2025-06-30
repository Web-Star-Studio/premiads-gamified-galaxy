
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardStats = () => {
  const [totalMissions, setTotalMissions] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Get missions count
        const { count: missionsCount, error: missionsError } = await supabase
          .from('missions')
          .select('*', { count: 'exact', head: true })
          .eq('advertiser_id', user.id);

        if (missionsError) throw missionsError;

        // Get advertiser profile for credits (rifas)
        const { data: profile, error: profileError } = await supabase
          .from('advertiser_profiles')
          .select('rifas')
          .eq('user_id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') throw profileError;

        setTotalMissions(missionsCount || 0);
        setTotalCredits(profile?.rifas || 0);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return {
    totalMissions,
    totalCredits,
    loading,
    error,
  };
};
