
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
        // Using rpc call to fetch campaigns since TypeScript doesn't recognize our new tables
        const { data: campaignsData, error: campaignsError } = await supabase
          .rpc('get_active_cashback_campaigns');

        // Get user's cashback balance using rpc
        const { data: profileData, error: profileError } = await supabase
          .rpc('get_user_cashback_balance', {
            user_id: (await supabase.auth.getUser()).data.user?.id
          });

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

      // Use rpc call to redeem cashback
      const { data, error } = await supabase
        .rpc('redeem_cashback', {
          p_user_id: userId,
          p_campaign_id: campaignId,
          p_amount: amount
        });

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
