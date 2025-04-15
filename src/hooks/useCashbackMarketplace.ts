
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CashbackCampaign, CashbackRedemption } from '@/types/cashback';
import { useUser } from '@/context/UserContext';

export const useCashbackMarketplace = () => {
  const [campaigns, setCampaigns] = useState<CashbackCampaign[]>([]);
  const [userCashback, setUserCashback] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { userName } = useUser();

  useEffect(() => {
    const fetchCashbackData = async () => {
      try {
        // Fetch active campaigns
        const { data: campaignsData, error: campaignsError } = await supabase
          .from('cashback_campaigns')
          .select('*')
          .eq('is_active', true)
          .lte('start_date', new Date().toISOString())
          .gte('end_date', new Date().toISOString());

        // Fetch user's cashback balance
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('cashback_balance')
          .eq('id', supabase.auth.getUser())
          .single();

        if (campaignsError) throw campaignsError;
        if (profileError) throw profileError;

        setCampaigns(campaignsData || []);
        setUserCashback(profileData?.cashback_balance || 0);
      } catch (error: any) {
        toast({
          title: 'Erro ao carregar cashback',
          description: error.message,
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCashbackData();
  }, []);

  const redeemCashback = async (campaignId: string, amount: number) => {
    try {
      const { data, error } = await supabase
        .from('cashback_redemptions')
        .insert({
          user_id: supabase.auth.getUser(),
          campaign_id: campaignId,
          amount
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Resgate efetuado',
        description: `Você resgatou R$ ${amount.toFixed(2)} de cashback`
      });

      return data;
    } catch (error: any) {
      toast({
        title: 'Erro no resgate',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return { 
    campaigns, 
    userCashback, 
    loading, 
    redeemCashback 
  };
};
