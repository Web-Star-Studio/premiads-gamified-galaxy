
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { Mission } from '@/hooks/missions/types';

export function useMissions() {
  const { user } = useAuthStore();
  
  const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

  return useQuery({
    queryKey: ['missions', 'core'],
    queryFn: async (): Promise<Mission[]> => {
      // Mock data for now - replace with actual API call
      const missionData: Mission[] = [
        {
          id: '1',
          title: 'Avalie nosso produto',
          description: 'Deixe uma avaliação honesta sobre nossa marca',
          brand: 'TechBrand',
          type: 'review',
          tickets_reward: 50,
          cashback_reward: 5.00,
          status: 'available',
          requirements: ['Fazer uma avaliação', 'Enviar screenshot'],
          has_badge: true,
          has_lootbox: false,
          rifas: 50
        },
        {
          id: '2',
          title: 'Tire uma foto do produto',
          description: 'Compartilhe uma foto usando nosso produto',
          brand: 'FashionCorp',
          type: 'photo',
          tickets_reward: 75,
          cashback_reward: 7.50,
          status: 'available',
          requirements: ['Foto em alta qualidade', 'Produto visível'],
          has_badge: false,
          has_lootbox: true,
          rifas: 75
        }
      ];

      return missionData;
    },
    enabled: !!user,
    staleTime: CACHE_TIME,
  });
}
