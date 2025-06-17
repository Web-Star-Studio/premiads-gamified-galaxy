import { supabase } from "@/integrations/supabase/client";
import { LootBoxRewardType } from "@/components/advertiser/LootBoxRewardsSelector";

export interface CreateMissionParams {
  title: string;
  description: string;
  requirements: string[];
  ticketsReward: number;
  cashbackReward: number;
  deadline?: string | null;
  type: string;
  businessType?: string;
  targetAudienceGender?: string;
  targetAudienceAgeMin?: number;
  targetAudienceAgeMax?: number;
  targetAudienceRegion?: string;
  hasBadge?: boolean;
  hasLootbox?: boolean;

  badgeImageUrl?: string;
  selectedLootBoxRewards?: LootBoxRewardType[];
  rifas: number;
}

export const createMission = async (params: CreateMissionParams) => {
  try {
    // Get the current user (advertiser)
    const { data: sessionData } = await supabase.auth.getSession();
    const advertiserId = sessionData?.session?.user?.id;
    
    if (!advertiserId) {
      throw new Error("Usuário não autenticado");
    }
    
    // Prepare mission data with tickets and cashback rewards
    const missionData = {
      title: params.title,
      description: params.description,
      requirements: params.requirements,
      rifas: params.rifas,
      tickets_reward: params.ticketsReward,
      cashback_reward: params.cashbackReward,
      end_date: params.deadline,
      type: params.type,
      business_type: params.businessType || null,
      target_audience_gender: params.targetAudienceGender || null,
      target_audience_age_min: params.targetAudienceAgeMin || null,
      target_audience_age_max: params.targetAudienceAgeMax || null,
      target_audience_region: params.targetAudienceRegion || null,
      has_badge: params.hasBadge || false,
      has_lootbox: params.hasLootbox || false,
      sequence_bonus: false,
      badge_image_url: params.badgeImageUrl || null,
      advertiser_id: advertiserId,
      is_active: true,
      status: 'ativa',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      selected_lootbox_rewards: params.hasLootbox ? params.selectedLootBoxRewards : null
    };
    
    console.log("Creating mission with data:", missionData);
    
    // Insert new mission
    const { data, error } = await supabase
      .from("missions")
      .insert([missionData])
      .select();
    
    if (error) {
      throw error;
    }
    
    return { success: true, data: data[0] };
  } catch (error: any) {
    console.error("Error creating mission:", error);
    return { 
      success: false, 
      error: error.message || "Erro ao criar missão" 
    };
  }
};
