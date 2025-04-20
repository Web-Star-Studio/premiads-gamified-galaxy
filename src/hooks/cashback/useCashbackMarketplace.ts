
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CashbackCampaign, CashbackRedemption } from '@/types/cashback';
import { useUser } from '@/context/UserContext';
import { 
  fetchCashbackCampaigns, 
  fetchUserCashbackBalance, 
  redeemCashback as apiRedeemCashback 
} from './cashbackApi';
import { supabase } from '@/integrations/supabase/client';

export const useCashbackMarketplace = () => {
  const [campaigns, setCampaigns] = useState<CashbackCampaign[]>([]);
  const [userCashback, setUserCashback] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { userName } = useUser();

  useEffect(() => {
    const fetchCashbackData = async () => {
      try {
        // First check if the user is authenticated
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.log("No authenticated session found - using empty data");
          setCampaigns([]);
          setUserCashback(0);
          setLoading(false);
          return;
        }
        
        // Fetch both campaigns and user cashback in parallel
        const [fetchedCampaigns, cashbackBalance] = await Promise.all([
          fetchCashbackCampaigns(),
          fetchUserCashbackBalance()
        ]);
        
        setCampaigns(fetchedCampaigns || []);
        setUserCashback(cashbackBalance || 0);
      } catch (error: any) {
        console.error("Error fetching cashback data:", error);
        toast({
          title: 'Erro ao carregar cashback',
          description: error.message || 'Falha ao carregar dados de cashback',
          variant: 'destructive'
        });
        
        // Use empty array and zero balance as fallback
        setCampaigns([]);
        setUserCashback(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCashbackData();
  }, [toast]);

  const redeemCashback = async (campaignId: string, amount: number) => {
    try {
      // Check if user is authenticated before attempting redemption
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        toast({
          title: 'Autenticação necessária',
          description: 'Você precisa estar logado para resgatar cashback.',
          variant: 'destructive'
        });
        return null;
      }
      
      const redemption = await apiRedeemCashback(campaignId, amount);
      
      if (redemption) {
        // Get the campaign that was redeemed
        const redeemedCampaign = campaigns.find(c => c.id === campaignId);
        
        toast({
          title: 'Resgate efetuado',
          description: `Você resgatou R$ ${amount.toFixed(2)} de cashback${redeemedCampaign ? ` com ${redeemedCampaign.discount_percentage}% de desconto` : ''}.`
        });
        
        // Update user cashback balance
        setUserCashback(prevCashback => prevCashback - amount);
        
        return redemption;
      }
      return null;
    } catch (error: any) {
      // Better error handling with more specific messages
      if (error.message.includes('logado') || error.message.includes('auth')) {
        toast({
          title: 'Autenticação necessária',
          description: 'Você precisa estar logado para resgatar cashback.',
          variant: 'destructive'
        });
      } else if (error.message.includes('saldo') || error.message.includes('balance')) {
        toast({
          title: 'Saldo insuficiente',
          description: 'Você não possui saldo suficiente para este resgate.',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Erro no resgate',
          description: error.message || 'Ocorreu um erro ao processar seu resgate.',
          variant: 'destructive'
        });
      }
      console.error("Cashback redemption error:", error);
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
