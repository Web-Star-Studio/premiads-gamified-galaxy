
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserCreditsData {
  userCredits: number;
  availableCredits: number;
  totalCredits: number;
  usedCredits: number;
  loading: boolean;
  isLoading: boolean;
}

export const useUserCredits = (): UserCreditsData & { refreshCredits: () => Promise<void> } => {
  const [userCredits, setUserCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCredits = async () => {
    if (!user?.id) {
      console.log('No user ID available, setting credits to 0');
      setUserCredits(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching credits for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('rifas')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user credits:', error);
        setUserCredits(0);
      } else {
        const rifasCount = data?.rifas || 0;
        console.log('Fetched rifas count:', rifasCount);
        setUserCredits(rifasCount);
      }
    } catch (error) {
      console.error('Error in fetchCredits:', error);
      setUserCredits(0);
    } finally {
      setLoading(false);
    }
  };

  const refreshCredits = async () => {
    await fetchCredits();
  };

  useEffect(() => {
    console.log('useUserCredits: user changed', user?.id);
    fetchCredits();
  }, [user?.id]);

  return {
    userCredits,
    availableCredits: userCredits,
    totalCredits: userCredits,
    usedCredits: 0,
    loading,
    isLoading: loading,
    refreshCredits
  };
};
