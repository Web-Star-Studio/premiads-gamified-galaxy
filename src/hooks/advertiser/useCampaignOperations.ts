import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { FormData } from '@/components/advertiser/campaign-form/types';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();

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
      const { error } = await (supabase.rpc as any)('create_campaign_and_debit_credits', {
        p_title: formData.title,
        p_description: formData.description,
        p_type: formData.type,
        p_audience: formData.audience,
        p_requirements: formData.requirements,
        p_start_date: formatDate(formData.startDate),
        p_end_date: formatDate(formData.endDate),
        p_has_badges: formData.hasBadges,
        p_has_lootbox: formData.hasLootBox,
        p_streak_bonus: formData.streakBonus,
        p_streak_multiplier: formData.streakMultiplier,
        p_random_points: formData.randomPoints,
        p_points_range: formData.pointsRange,
        p_rifas: formData.rifas,
        p_tickets_reward: formData.ticketsReward,
        p_cashback_reward: formData.cashbackReward,
        p_max_participants: formData.maxParticipants,
        p_cashback_amount_per_raffle: formData.cashbackAmountPerRaffle,
        p_target_filter: formData.targetFilter,
        p_badge_image_url: formData.badgeImageUrl,
        p_min_purchase: formData.minPurchase,
        p_selected_loot_box_rewards: formData.selectedLootBoxRewards,
        p_form_schema: formData.formSchema,
      });

      if (error) throw error;
      
      toast({
        title: 'Campanha criada com sucesso',
        description: 'Sua campanha foi criada e está pronta para ser publicada',
      });
      
      // Refresh user rifas and dashboard metrics
      queryClient.invalidateQueries({ queryKey: ['user-rifas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      
      return true;
    } catch (error: any) {
      console.warn('RPC create_campaign_and_debit_credits failed, falling back:', error);
      // Fallback for missing RPC function or unavailable schema
      if (error.code === 'PGRST202' || error.message?.includes('not found')) {
        // Two-step fallback: deduct credits then create mission
        const totalDebit = formData.rifas * formData.maxParticipants;
        // 1. Fetch current credits
        const { data: profile, error: profileErr } = await supabase
          .from('profiles')
          .select('rifas')
          .eq('id', user.id)
          .single();
        if (profileErr) throw profileErr;
        if (profile.rifas < totalDebit) {
          toast({
            title: 'Envio cancelado',
            description: `Saldo insuficiente: você tem ${profile.rifas} rifas mas tentou usar ${totalDebit}.`,
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return false;
        }
        // 2. Deduct rifas
        const { error: updateErr } = await supabase
          .from('profiles')
          .update({ rifas: profile.rifas - totalDebit })
          .eq('id', user.id);
        if (updateErr) throw updateErr;
        // 3. Insert mission
        const missionData = {
          title: formData.title,
          description: formData.description,
          type: formData.type,
          target_audience: formData.audience,
          requirements: Array.isArray(formData.requirements) ? formData.requirements : [formData.requirements],
          start_date: formatDate(formData.startDate),
          end_date: formatDate(formData.endDate),
          has_badge: formData.hasBadges,
          has_lootbox: formData.hasLootBox,
          sequence_bonus: formData.streakBonus,
          streak_multiplier: formData.streakMultiplier,
          random_points: formData.randomPoints,
          points_range: formData.pointsRange,
          rifas: formData.rifas,
          tickets_reward: formData.ticketsReward,
          cashback_reward: formData.cashbackReward,
          max_participants: formData.maxParticipants,
          cashback_amount_per_raffle: formData.cashbackAmountPerRaffle,
          target_filter: formData.targetFilter,
          badge_image_url: formData.badgeImageUrl,
          min_purchase: formData.minPurchase,
          selected_lootbox_rewards: formData.selectedLootBoxRewards,
          form_schema: formData.formSchema,
          created_by: user.id,
        };
        if (!missionData.created_by) throw new Error('Campo created_by obrigatório na missão!');
        const { error: insertErr } = await (supabase.from('missions') as any)
          .insert(missionData, { returning: 'minimal' });
        if (insertErr) throw insertErr;
        // success fallback
      } else {
        // Other errors
        throw error;
      }
    } finally {
      setIsSubmitting(false);
    }
    // Refresh queries
    queryClient.invalidateQueries({ queryKey: ['user-rifas'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });

    toast({
      title: 'Campanha criada com sucesso',
      description: 'Sua campanha foi criada e está pronta para ser publicada',
    });
    return true;
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
        rifas: formData.rifas,
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
