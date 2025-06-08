
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useUserCredits = () => {
  const [userCredits, setUserCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCredits = async () => {
    if (!user) {
      setUserCredits(0);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('rifas')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user credits:', error);
        setUserCredits(0);
      } else {
        setUserCredits(data?.rifas || 0);
      }
    } catch (error) {
      console.error('Error fetching user credits:', error);
      setUserCredits(0);
    } finally {
      setLoading(false);
    }
  };

  const refreshCredits = async () => {
    await fetchCredits();
  };

  useEffect(() => {
    fetchCredits();
  }, [user]);

  return {
    userCredits,
    loading,
    refreshCredits
  };
};
