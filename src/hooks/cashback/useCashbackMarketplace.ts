
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CashbackCampaign, CashbackRedemption } from '@/types/cashback';
import { useUser } from '@/context/UserContext';
import { 
  fetchCashbackCampaigns, 
  fetchUserCashbackBalance, 
  redeemCashback as apiRedeemCashback 
} from './cashbackApi';
import { MOCK_CASHBACK_CAMPAIGNS } from './cashbackMockData';

export const useCashbackMarketplace = () => {
  const [campaigns, setCampaigns] = useState<CashbackCampaign[]>([]);
  const [userCashback, setUserCashback] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { userName } = useUser();

  useEffect(() => {
    const fetchCashbackData = async () => {
      try {
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
          description: error.message,
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
      // Handle demo mode
      if (error.message.includes('logado')) {
        toast({
          title: 'Modo Demo',
          description: 'No modo de demonstração, você pode visualizar mas não resgatar cashback. Faça login para utilizar esta função.',
        });
      } else {
        toast({
          title: 'Erro no resgate',
          description: error.message,
          variant: 'destructive'
        });
      }
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
