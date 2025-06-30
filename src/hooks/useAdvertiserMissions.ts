
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAdvertiserMissions = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error: fetchError } = await supabase
          .from('missions')
          .select('*')
          .eq('advertiser_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        setMissions(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  return {
    missions,
    loading,
    error,
  };
};
