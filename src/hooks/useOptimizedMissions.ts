
import { useState, useEffect } from 'react';
import { Mission } from '@/types/missions';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';

export const useOptimizedMissions = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser(); // Fixed: Use user directly from context

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        
        // Fetch missions with optimized query
        const { data: missionsData, error: missionsError } = await supabase
          .from('missions')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (missionsError) throw missionsError;

        // Transform missions data
        const transformedMissions: Mission[] = (missionsData || []).map(mission => ({
          id: mission.id,
          title: mission.title,
          description: mission.description || '',
          requirements: Array.isArray(mission.requirements) ? mission.requirements : [],
          rifas: mission.rifas || 0,
          cashbackReward: mission.cashback_reward || 0,
          deadline: mission.end_date,
          type: mission.type,
          businessType: '',
          targetAudienceGender: '',
          targetAudienceAgeMin: undefined,
          targetAudienceAgeMax: undefined,
          targetAudienceRegion: '',
          hasBadge: mission.has_badge || false,
          hasLootbox: mission.has_lootbox || false,
          sequenceBonus: mission.sequence_bonus || false,
          badgeImageUrl: mission.badge_image_url,
          selectedLootBoxRewards: mission.selected_lootbox_rewards || [],
          advertiser: {
            id: mission.advertiser_id || '',
            name: 'Anunciante',
            logo: '',
          },
          progress: {
            current: 0,
            total: mission.max_participants || 100,
          },
          category: 'geral',
          isCompleted: false,
          hasSubmitted: false,
          totalParticipants: 0,
          completionRate: 0,
          minPurchase: 0,
          startDate: mission.start_date || mission.created_at,
          endDate: mission.end_date || null,
          isActive: mission.is_active,
          createdAt: mission.created_at,
          updatedAt: mission.updated_at
        }));

        setMissions(transformedMissions);
      } catch (err: any) {
        console.error('Error fetching optimized missions:', err);
        setError(err.message);
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
