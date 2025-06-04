import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { FormData } from '@/components/advertiser/campaign-form/types';
import { useAuth } from '@/hooks/useAuth';

// Helper function to format dates as ISO strings
const formatDate = (date: Date | string): string => {
  if (date instanceof Date) {
    return date.toISOString();
  }
  return date;
};

const useCampaignOperations = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const createCampaign = async (formData: FormData) => {
    if (!user) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado para criar uma campanha',
        variant: 'destructive',
      });
      return false;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert the formData to the expected mission format and format dates
      const missionData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        target_audience: formData.audience,
        requirements: Array.isArray(formData.requirements) 
          ? formData.requirements 
          : [formData.requirements],
        business_type: 'retail',
        target_audience_gender: formData.targetFilter?.gender || 'all',
        target_audience_age_min: formData.targetFilter?.age?.[0] 
          ? parseInt(formData.targetFilter.age[0]) 
          : 18,
        target_audience_age_max: formData.targetFilter?.age?.[1] 
          ? parseInt(formData.targetFilter.age[1]) 
          : 65,
        target_audience_region: formData.targetFilter?.region?.join(',') || 'all',
        start_date: formatDate(formData.startDate),
        end_date: formatDate(formData.endDate),
        status: 'ativa',
        has_badge: formData.hasBadges,
        has_lootbox: formData.hasLootBox,
        sequence_bonus: formData.streakBonus,
        streak_multiplier: formData.streakMultiplier,
        badge_image_url: formData.badgeImageUrl,
        selected_lootbox_rewards: formData.selectedLootBoxRewards || [
          'random_badge', 'multiplier', 'level_up', 'daily_streak_bonus', 'raffle_ticket'
        ],
        tickets_reward: formData.ticketsReward,
        cashback_reward: formData.cashbackReward,
        target_filter: formData.targetFilter || {},
        advertiser_id: user.id,
        created_by: user.id,
        max_participants: formData.maxParticipants || 100,
        max_cashback_redemptions: formData.maxCashbackRedemptions || 5,
        cashback_amount_per_raffle: 5.00 // Valor fixo
      };
      
      console.log('DEBUG missionData sendo enviado:', missionData);
      console.log('DEBUG keys:', Object.keys(missionData));
      
      // Insert the new mission without returning columns to avoid schema cache errors
      const { error: insertError } = await (supabase.from('missions') as any)
        .insert(missionData, { returning: 'minimal' })
      if (insertError) throw insertError
      
      toast({
        title: 'Campanha criada com sucesso',
        description: 'Sua campanha foi criada e está pronta para ser publicada',
      });
      
      return true;
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast({
        title: 'Erro ao criar campanha',
        description: error.message || 'Ocorreu um erro ao criar a campanha',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCampaign = async (campaignId: string, formData: FormData) => {
    if (!user) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado para editar uma campanha',
        variant: 'destructive',
      });
      return false;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert the formData to the expected mission format with formatted dates
      const missionData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        target_audience: formData.audience,
        requirements: Array.isArray(formData.requirements) 
          ? formData.requirements 
          : [formData.requirements], // Convert to array if it's a string
        business_type: 'retail', // Default
        target_audience_gender: formData.targetFilter?.gender || 'all',
        target_audience_age_min: formData.targetFilter?.age?.[0] 
          ? parseInt(formData.targetFilter.age[0]) 
          : 18,
        target_audience_age_max: formData.targetFilter?.age?.[1] 
          ? parseInt(formData.targetFilter.age[1]) 
          : 65,
        target_audience_region: formData.targetFilter?.region?.join(',') || 'all',
        start_date: formatDate(formData.startDate),
        end_date: formatDate(formData.endDate),
        has_badge: formData.hasBadges,
        has_lootbox: formData.hasLootBox,
        sequence_bonus: formData.streakBonus,
        streak_multiplier: formData.streakMultiplier,
        badge_image_url: formData.badgeImageUrl,
        selected_lootbox_rewards: formData.selectedLootBoxRewards || [
          'random_badge', 'multiplier', 'level_up', 'daily_streak_bonus', 'raffle_ticket'
        ],
        tickets_reward: formData.ticketsReward,
        cashback_reward: formData.cashbackReward,
        target_filter: formData.targetFilter || {},
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('missions')
        .update(missionData)
        .eq('id', campaignId)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Campanha atualizada',
        description: 'Sua campanha foi atualizada com sucesso',
      });
      
      return true;
    } catch (error: any) {
      console.error('Error updating campaign:', error);
      toast({
        title: 'Erro ao atualizar campanha',
        description: error.message || 'Ocorreu um erro ao atualizar a campanha',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    createCampaign,
    updateCampaign
  };
};

export default useCampaignOperations;
