
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSounds } from '@/hooks/use-sounds';
import { FormData } from '@/components/advertiser/campaign-form/types';

export const useCampaignOperations = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { playSound } = useSounds();

  const createCampaign = async (formData: FormData) => {
    try {
      setLoading(true);
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .single();

      const { data, error } = await supabase
        .from('cashback_campaigns')
        .insert({
          title: formData.title,
          description: formData.description,
          discount_percentage: formData.pointsRange[0],
          advertiser_id: (await supabase.auth.getUser()).data.user?.id,
          advertiser_name: profile?.full_name,
          conditions: formData.requirements?.join(', '),
          expires_at: formData.endDate,
          is_active: true,
          min_purchase: formData.minPurchase || 0
        })
        .select()
        .single();

      if (error) throw error;

      playSound('success');
      toast({
        title: 'Campanha criada',
        description: 'Sua campanha foi criada com sucesso!'
      });

      return data;
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      playSound('error');
      toast({
        title: 'Erro ao criar campanha',
        description: error.message,
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCampaign = async (id: string, formData: FormData) => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('cashback_campaigns')
        .update({
          title: formData.title,
          description: formData.description,
          discount_percentage: formData.pointsRange[0],
          conditions: formData.requirements?.join(', '),
          expires_at: formData.endDate,
          min_purchase: formData.minPurchase || 0
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      playSound('success');
      toast({
        title: 'Campanha atualizada',
        description: 'Sua campanha foi atualizada com sucesso!'
      });

      return data;
    } catch (error: any) {
      console.error('Error updating campaign:', error);
      playSound('error');
      toast({
        title: 'Erro ao atualizar campanha',
        description: error.message,
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCampaign,
    updateCampaign,
    loading
  };
};
