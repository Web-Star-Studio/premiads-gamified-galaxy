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
      // Calcular custo total da campanha
      const totalCost = formData.rifas * (formData.maxParticipants || 100);
      
      console.log('Creating campaign with atomic function:', {
        title: formData.title,
        totalCost,
        rifas: formData.rifas,
        maxParticipants: formData.maxParticipants
      });

      // Converter o array de selectedLootBoxRewards para um objeto JSONB
      const selectedLootboxRewardsJSON = formData.selectedLootBoxRewards ? JSON.parse(JSON.stringify(formData.selectedLootBoxRewards)) : [];
      
      // Converter o array pointsRange para um objeto JSONB
      const pointsRangeJSON = formData.pointsRange ? JSON.parse(JSON.stringify(formData.pointsRange)) : [0, 0];

      // Usar a função RPC atômica para criar a campanha e debitar rifas
      const { data: campaignId, error } = await supabase.rpc('create_campaign_atomic', {
        p_title: formData.title,
        p_description: formData.description,
        p_type: formData.type,
        p_target_audience: formData.audience, // Corrigido: usar target_audience
        p_requirements: formData.requirements,
        p_start_date: formatDate(formData.startDate),
        p_end_date: formatDate(formData.endDate),
        p_has_badge: formData.hasBadges,
        p_has_lootbox: formData.hasLootBox,
        p_sequence_bonus: formData.streakBonus,
        p_streak_multiplier: formData.streakMultiplier,
        p_random_points: formData.randomPoints,
        p_points_range: pointsRangeJSON,
        p_rifas: formData.rifas,
        p_tickets_reward: formData.ticketsReward,
        p_cashback_reward: formData.cashbackReward,
        p_max_participants: formData.maxParticipants || 100,
        p_cashback_amount_per_raffle: formData.cashbackAmountPerRaffle || 5.00,
        p_target_filter: formData.targetFilter || {},
        p_badge_image_url: formData.badgeImageUrl,
        p_min_purchase: formData.minPurchase || 0,
        p_selected_lootbox_rewards: selectedLootboxRewardsJSON,
        p_form_schema: (formData.formSchema as any) || []
      });

      if (error) {
        console.error('RPC error:', error);
        throw error;
      }
      
      console.log('Campaign created successfully with ID:', campaignId);
      
      toast({
        title: 'Campanha criada com sucesso!',
        description: `Sua campanha foi criada e está ativa. ${totalCost} rifas foram debitadas da sua conta.`,
      });
      
      // Refresh user rifas and dashboard metrics
      queryClient.invalidateQueries({ queryKey: ['user-rifas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['advertiser-campaigns'] });
      
      return true;
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      
      // Tratamento específico para erro de saldo insuficiente
      if (error.message?.includes('Saldo insuficiente')) {
        toast({
          title: 'Saldo insuficiente',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Erro ao criar campanha',
          description: error.message || 'Ocorreu um erro ao criar a campanha',
          variant: 'destructive',
        });
      }
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
      // Converter o array de selectedLootBoxRewards para um objeto JSONB
      const selectedLootboxRewardsJSON = formData.selectedLootBoxRewards ? JSON.parse(JSON.stringify(formData.selectedLootBoxRewards)) : [];
      
      // Converter o array pointsRange para um objeto JSONB
      const pointsRangeJSON = formData.pointsRange ? JSON.parse(JSON.stringify(formData.pointsRange)) : [0, 0];

      // Mapear os dados do formulário para a estrutura da tabela missions
      const missionData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        target_audience: formData.audience, // Corrigido: usar target_audience
        requirements: formData.requirements,
        start_date: formatDate(formData.startDate),
        end_date: formatDate(formData.endDate),
        has_badge: formData.hasBadges,
        has_lootbox: formData.hasLootBox,
        sequence_bonus: formData.streakBonus,
        streak_multiplier: formData.streakMultiplier,
        badge_image_url: formData.badgeImageUrl,
        selected_lootbox_rewards: selectedLootboxRewardsJSON,
        points_range: pointsRangeJSON,
        random_points: formData.randomPoints,
        rifas: formData.rifas,
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
      
      // Refresh campaigns list
      queryClient.invalidateQueries({ queryKey: ['advertiser-campaigns'] });
      
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
