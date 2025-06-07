
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Badge {
  id: string;
  badge_name: string;
  badge_description?: string;
  badge_image_url?: string;
  earned_at: string;
  mission_id: string;
}

export const useRewards = (userId: string | null) => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchRewards = async () => {
      try {
        setLoading(true);

        // Fetch user badges
        const { data: badgesData, error: badgesError } = await supabase
          .from('user_badges')
          .select('*')
          .eq('user_id', userId)
          .order('earned_at', { ascending: false });

        if (badgesError) throw badgesError;

        setBadges(badgesData || []);

      } catch (error: any) {
        console.error('Error fetching rewards:', error);
        toast({
          title: 'Erro ao carregar recompensas',
          description: error.message || 'Falha ao carregar badges e loot boxes',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [userId, toast]);

  return {
    badges,
    loading
  };
};
