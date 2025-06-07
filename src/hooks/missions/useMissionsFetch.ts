import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Mission } from '@/types/missions';

interface Advertiser {
  id: string;
  name: string;
  logo: string;
}

interface Progress {
  current: number;
  total: number;
}

export interface MissionData {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  rifas: number;
  cashbackReward: number;
  deadline: string;
  type: string;
  businessType: string;
  targetAudienceGender: string;
  targetAudienceAgeMin: number | undefined;
  targetAudienceAgeMax: number | undefined;
  targetAudienceRegion: string;
  hasBadge: boolean;
  hasLootbox: boolean;
  sequenceBonus: boolean;
  badgeImageUrl: string;
  selectedLootBoxRewards: string[];
  advertiser: Advertiser;
  progress: Progress;
  category: string;
  isCompleted: boolean;
  hasSubmitted: boolean;
  totalParticipants: number;
  completionRate: number;
  minPurchase: number;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useMissionsFetch = (userId?: string) => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('missions')
        .select(`
          *
        `)
        .eq('is_active', true);

      const { data: missionsData, error: missionsError } = await query;

      if (missionsError) {
        throw missionsError;
      }

      if (!missionsData) {
        setMissions([]);
        return;
      }

      // Transform missions data
      const transformedMissions: Mission[] = missionsData.map(mission => ({
        id: mission.id,
        title: mission.title,
        description: mission.description || '',
        requirements: Array.isArray(mission.requirements) ? mission.requirements : [],
        rifas: mission.rifas || 0, // Fixed: Use rifas directly from schema
        cashbackReward: mission.cashback_reward || 0,
        deadline: mission.end_date,
        type: mission.type,
        businessType: '', // Fixed: No business_type column
        targetAudienceGender: '', // Fixed: These are in target_filter JSONB
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
        minPurchase: 0, // Fixed: No min_purchase column in missions
        startDate: mission.start_date || mission.created_at,
        endDate: mission.end_date || null,
        isActive: mission.is_active,
        createdAt: mission.created_at,
        updatedAt: mission.updated_at
      }));

      setMissions(transformedMissions);
    } catch (err: any) {
      console.error('Error fetching missions:', err);
      setError(err.message || 'Erro ao carregar missões');
      setMissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  return {
    missions,
    loading,
    error,
    refetch: fetchMissions
  };
};
