import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CashbackCampaign, CashbackRedemption } from '@/types/cashback';
import { useUser } from '@/context/UserContext';
import { 
  fetchCashbackCampaigns, 
  fetchUserCashbackBalance, 
  redeemCashback as apiRedeemCashback 
} from './cashbackApi';
import { getSupabaseClient } from '@/lib/supabaseClient'

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
        const supabase = await getSupabaseClient()
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
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
      const supabase = await getSupabaseClient()
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
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
          description: `Você resgatou R$ ${amount.toFixed(2)} de cashback${redeemedCampaign ? ` com ${redeemedCampaign.cashback_percentage}% de desconto` : ''}.` // Fixed: Use cashback_percentage
        });
        
        // Update local state
        setUserCashback(prev => prev - amount);
        
        return redemption;
      }
    } catch (error: any) {
      console.error("Error redeeming cashback:", error);
      toast({
        title: 'Erro no resgate',
        description: error.message || 'Falha ao resgatar cashback',
        variant: 'destructive'
      });
    }
    
    return null;
  };

  return {
    campaigns,
    userCashback,
    loading,
    redeemCashback
  };
};
