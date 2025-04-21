
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSounds } from '@/hooks/use-sounds';
import { CashbackCampaign, CashbackRedemption, CashbackHook } from '@/types/cashback';
import { 
  fetchCashbackCampaigns, 
  fetchUserCashbackBalance, 
  redeemCashback as apiRedeemCashback 
} from './cashbackApi';

/**
 * Hook for cashback marketplace functionality
 * This provides mock data for now and will be integrated with Supabase later
 */
export const useCashbackMarketplace = (): CashbackHook => {
  const [campaigns, setCampaigns] = useState<CashbackCampaign[]>([]);
  const [userCashback, setUserCashback] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const { playSound } = useSounds();

  // Load cashback data on component mount
  useEffect(() => {
    const loadCashbackData = async () => {
      setLoading(true);
      try {
        // Fetch campaigns and user cashback balance
        const fetchedCampaigns = await fetchCashbackCampaigns();
        const fetchedBalance = await fetchUserCashbackBalance();
        
        setCampaigns(fetchedCampaigns);
        setUserCashback(fetchedBalance);
      } catch (error) {
        console.error("Error loading cashback data:", error);
        toast({
          title: "Erro ao carregar cashback",
          description: "Não foi possível carregar os dados de cashback",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadCashbackData();
  }, [toast]);

  // Function to redeem cashback
  const redeemCashback = async (campaignId: string, amount: number): Promise<CashbackRedemption | null> => {
    try {
      const redemption = await apiRedeemCashback(campaignId, amount);
      
      // Update user cashback balance after redemption
      setUserCashback(prevBalance => prevBalance - amount);
      
      // Play success sound
      playSound("chime");
      
      // Show success toast
      toast({
        title: "Cashback resgatado",
        description: `Você resgatou R$ ${amount} em cashback com sucesso!`,
      });
      
      return redemption;
    } catch (error: any) {
      // Play error sound
      playSound("error");
      
      // Show error toast
      toast({
        title: "Erro ao resgatar cashback",
        description: error.message || "Não foi possível realizar o resgate",
        variant: "destructive"
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

export * from './cashbackApi';
export * from './mockData';
