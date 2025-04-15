
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
        // Fetch active campaigns using raw SQL since the types don't know about our new tables
        const { data: campaignsData, error: campaignsError } = await supabase
          .from('cashback_campaigns')
          .select('*')
          .eq('is_active', true)
          .lte('start_date', new Date().toISOString())
          .gte('end_date', new Date().toISOString());

        // Get user's cashback balance
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('cashback_balance')
          .eq('id', (await supabase.auth.getUser()).data.user?.id)
          .single();

        if (campaignsError) throw campaignsError;
        if (profileError) throw profileError;

        setCampaigns(campaignsData as CashbackCampaign[] || []);
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
  }, [toast]);

  const redeemCashback = async (campaignId: string, amount: number) => {
    try {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;

      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('cashback_redemptions')
        .insert({
          user_id: userId,
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

      return data as CashbackRedemption;
    } catch (error: any) {
      toast({
        title: 'Erro no resgate',
        description: error.message,
        variant: 'destructive'
      });
      return null;
    }
  };

  return { 
    campaigns, 
    userCashback, 
    loading, 
    redeemCashback 
  };
};
