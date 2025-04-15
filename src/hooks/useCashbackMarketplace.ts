
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CashbackCampaign, CashbackRedemption } from '@/types/cashback';
import { useUser } from '@/context/UserContext';

// Helper type for RPC calls
type RPCResponse<T> = {
  data: T | null;
  error: any;
};

// Constants for Supabase URL and API key - using the values from the client
const SUPABASE_URL = "https://lidnkfffqkpfwwdrifyt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZG5rZmZmcWtwZnd3ZHJpZnl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NzUxOTYsImV4cCI6MjA2MDI1MTE5Nn0.sZD_dXHgI0larkHDCTgLtWrbtoVGZcWR2nOWffiS2Os";

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
        const campaignsResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_active_cashback_campaigns`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        });
        
        const campaignsData = await campaignsResponse.json();
        
        // Get user authenticated user
        const { data: { user } } = await supabase.auth.getUser();
        
        // Get user's cashback balance using rpc
        const profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_user_cashback_balance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          },
          body: JSON.stringify({ user_id: user?.id })
        });
        
        const profileData = await profileResponse.json();

        // Enhance campaigns with advertiser data (in a real app, this would come from the database)
        const enhancedCampaigns = (campaignsData || []).map((campaign: CashbackCampaign) => {
          const index = parseInt(campaign.id.substring(0, 2), 16) % advertisers.length;
          const conditionIndex = parseInt(campaign.id.substring(2, 4), 16) % conditions.length;
          
          return {
            ...campaign,
            advertiser_logo: advertisers[index].logo,
            advertiser_name: advertisers[index].name,
            conditions: conditions[conditionIndex]
          };
        });

        setCampaigns(enhancedCampaigns);
        setUserCashback(profileData && profileData[0] ? profileData[0].cashback_balance || 0 : 0);
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
        setUserCashback(0); // Since we're using all cashback in this version
        
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
