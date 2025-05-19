
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
        status: 'ativa',
        has_badges: formData.hasBadges,
        has_lootbox: formData.hasLootBox,
        streak_bonus: formData.streakBonus,
        streak_multiplier: formData.streakMultiplier,
        points: formData.randomPoints 
          ? Math.floor(Math.random() * (formData.pointsRange[1] - formData.pointsRange[0] + 1)) + formData.pointsRange[0]
          : formData.pointsValue || formData.pointsRange[0],
        cost_in_tokens: formData.randomPoints 
          ? Math.floor(Math.random() * (formData.pointsRange[1] - formData.pointsRange[0] + 1)) + formData.pointsRange[0]
          : formData.pointsValue || formData.pointsRange[0],
        target_filter: formData.targetFilter || {},
        advertiser_id: user.id,
        created_by: user.id
      };
      
      // Deduct tokens from advertiser's balance
      const { error: deductError } = await supabase.rpc('deduct_credits_from_advertiser', {
        p_advertiser_id: user.id, 
        p_credits_to_deduct: missionData.cost_in_tokens
      });
      
      if (deductError) {
        throw new Error(`Erro ao debitar tokens: ${deductError.message}`);
      }
      
      // Insert the new mission
      const { data, error } = await supabase
        .from('missions')
        .insert(missionData)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
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
        has_badges: formData.hasBadges,
        has_lootbox: formData.hasLootBox,
        streak_bonus: formData.streakBonus,
        streak_multiplier: formData.streakMultiplier,
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
