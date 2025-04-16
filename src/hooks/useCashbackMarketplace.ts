
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CashbackCampaign, CashbackRedemption } from '@/types/cashback';
import { useUser } from '@/context/UserContext';

// Mock data for when no authenticated user is available
const MOCK_CASHBACK_CAMPAIGNS: CashbackCampaign[] = [
  {
    id: "1",
    advertiser_id: "101",
    title: "Cashback 15% Ciao Moda Masculina",
    description: "Ganhe 15% de cashback em compras acima de R$80",
    discount_percentage: 15,
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    minimum_purchase: 80,
    maximum_discount: 60,
    is_active: true,
    conditions: "Válido para compras acima de R$80",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    advertiser_logo: "https://via.placeholder.com/80x80.png?text=CM",
    advertiser_name: "Ciao Moda Masculina"
  },
  {
    id: "2",
    advertiser_id: "102",
    title: "Cashback 20% Forneria 1121",
    description: "Ganhe 20% de cashback em pizzas",
    discount_percentage: 20,
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    minimum_purchase: 50,
    maximum_discount: 40,
    is_active: true,
    conditions: "Válido para pedidos acima de R$50",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    advertiser_logo: "https://via.placeholder.com/80x80.png?text=F1121",
    advertiser_name: "Forneria 1121"
  },
  {
    id: "3",
    advertiser_id: "103",
    title: "Cashback 25% Homepizza",
    description: "Ganhe 25% de cashback em delivery de pizza",
    discount_percentage: 25,
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    minimum_purchase: 40,
    maximum_discount: 30,
    is_active: true,
    conditions: "Válido para pedidos acima de R$40",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    advertiser_logo: "https://via.placeholder.com/80x80.png?text=HP",
    advertiser_name: "Homepizza"
  }
];

// Mock data for advertiser logos and names
const advertisers = [
  { 
    name: "Restaurantes", 
    logo: "https://via.placeholder.com/80x80.png?text=R" 
  },
  { 
    name: "Tecnologia", 
    logo: "https://via.placeholder.com/80x80.png?text=T" 
  },
  { 
    name: "Varejo", 
    logo: "https://via.placeholder.com/80x80.png?text=V" 
  },
  { 
    name: "Saúde", 
    logo: "https://via.placeholder.com/80x80.png?text=S" 
  },
  { 
    name: "Beleza", 
    logo: "https://via.placeholder.com/80x80.png?text=B" 
  },
  { 
    name: "Serviços", 
    logo: "https://via.placeholder.com/80x80.png?text=Svc" 
  }
];

// Mock conditions for campaigns
const conditions = [
  "Válido somente para compras online.",
  "Não cumulativo com outras promoções.",
  "Cashback limitado a uma utilização por CPF.",
  "Válido para todos os produtos da loja, exceto eletrônicos.",
  "Necessário cadastro no programa de fidelidade da loja.",
  "Válido apenas para a primeira compra."
];

// Helper type for RPC calls
type RPCResponse<T> = {
  data: T | null;
  error: any;
};

// Constants for Supabase URL and API key - using the values from the client
const SUPABASE_URL = "https://lidnkfffqkpfwwdrifyt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZG5rZmZmcWtwZnd3ZHJpZnl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NzUxOTYsImV4cCI6MjA2MDI1MTE5Nn0.sZD_dXHgI0larkHDCTgLtWrbtoVGZcWR2nOWffiS2Os";

export const useCashbackMarketplace = () => {
  const [campaigns, setCampaigns] = useState<CashbackCampaign[]>([]);
  const [userCashback, setUserCashback] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { userName } = useUser();

  useEffect(() => {
    const fetchCashbackData = async () => {
      try {
        // Check if user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          console.log("No authenticated user found - using mock cashback data");
          setCampaigns(MOCK_CASHBACK_CAMPAIGNS);
          // Set mock cashback balance for demo
          setUserCashback(57.25);
          setLoading(false);
          return;
        }
        
        // Using direct fetch for RPC call because our DB schema can change
        try {
          // Get active campaigns
          const campaignsResponse = await fetch(`${SUPABASE_URL}/rest/v1/cashback_campaigns?is_active=eq.true`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${SUPABASE_KEY}`
            }
          });
          
          let campaignsData = await campaignsResponse.json();
          
          // Get user's cashback balance
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("cashback_balance")
            .eq("id", user.id)
            .single();
            
          // Enhance campaigns with advertiser data if needed
          const enhancedCampaigns = (campaignsData || []).map((campaign: CashbackCampaign) => {
            // Only add advertiser info if it's missing
            if (!campaign.advertiser_logo || !campaign.advertiser_name) {
              const index = parseInt(campaign.id.substring(0, 2), 16) % advertisers.length;
              const conditionIndex = parseInt(campaign.id.substring(2, 4), 16) % conditions.length;
              
              return {
                ...campaign,
                advertiser_logo: campaign.advertiser_logo || advertisers[index].logo,
                advertiser_name: campaign.advertiser_name || advertisers[index].name,
                conditions: campaign.conditions || conditions[conditionIndex]
              };
            }
            return campaign;
          });

          setCampaigns(enhancedCampaigns);
          setUserCashback(profileData?.cashback_balance || 0);
        } catch (rpcError: any) {
          // Fallback to mock data if RPC fails
          console.error("Error with cashback RPC calls, using mock data:", rpcError);
          setCampaigns(MOCK_CASHBACK_CAMPAIGNS);
          setUserCashback(57.25);
        }
      } catch (error: any) {
        console.error("Error fetching cashback data:", error);
        toast({
          title: 'Erro ao carregar cashback',
          description: error.message,
          variant: 'destructive'
        });
        // Fallback to mock data in case of any error
        setCampaigns(MOCK_CASHBACK_CAMPAIGNS);
        setUserCashback(57.25);
      } finally {
        setLoading(false);
      }
    };

    fetchCashbackData();
  }, [toast]);

  const redeemCashback = async (campaignId: string, amount: number) => {
    try {
      // Check if user is authenticated first
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast({
          title: 'Modo Demo',
          description: 'No modo de demonstração, você pode visualizar mas não resgatar cashback. Faça login para utilizar esta função.',
        });
        return null;
      }
      
      const userId = user.id;

      // Use direct fetch for RPC call to avoid TypeScript issues
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/redeem_cashback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        },
        body: JSON.stringify({
          p_user_id: userId,
          p_campaign_id: campaignId,
          p_amount: amount
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Get the campaign that was redeemed
        const redeemedCampaign = campaigns.find(c => c.id === campaignId);
        
        toast({
          title: 'Resgate efetuado',
          description: `Você resgatou R$ ${amount.toFixed(2)} de cashback${redeemedCampaign ? ` com ${redeemedCampaign.discount_percentage}% de desconto` : ''}.`
        });
        
        // Update user cashback balance
        setUserCashback(prevCashback => prevCashback - amount);
        
        return data as CashbackRedemption;
      } else {
        throw new Error(data.message || 'Erro no resgate de cashback');
      }
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
