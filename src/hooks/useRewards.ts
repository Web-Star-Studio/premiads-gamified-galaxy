
import { useQuery } from '@tanstack/react-query';
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
  const { toast } = useToast();

  // Query para buscar badges do usuário
  const {
    data: badges = [],
    isLoading: loading,
    error
  } = useQuery({
    queryKey: ['rewards', 'badges', userId],
    queryFn: async (): Promise<Badge[]> => {
      if (!userId) return [];

      // Fetch user badges
      const { data: badgesData, error: badgesError } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      if (badgesError) throw badgesError;

      return badgesData || [];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    retry: 3
  });

  // Handle query errors
  if (error) {
    console.error('Error fetching rewards:', error);
    toast({
      title: 'Erro ao carregar recompensas',
      description: error.message || 'Falha ao carregar badges e loot boxes',
      variant: 'destructive'
    });
  }

  return {
    badges,
    loading
  };
};
