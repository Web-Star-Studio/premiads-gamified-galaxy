import { supabase } from '@/integrations/supabase/client';
import { CashbackCampaign, CashbackRedemption } from '@/types/cashback';

// Constants for Supabase URL and API key
const SUPABASE_URL = "https://lidnkfffqkpfwwdrifyt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZG5rZmZmcWtwZnd3ZHJpZnl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NzUxOTYsImV4cCI6MjA2MDI1MTE5Nn0.sZD_dXHgI0larkHDCTgLtWrbtoVGZcWR2nOWffiS2Os";

export interface FetchCashbackResult {
  campaigns: CashbackCampaign[];
  userCashback: number;
}

/**
 * Fetches active cashback campaigns from the Supabase database
 */
export const fetchCashbackCampaigns = async (): Promise<CashbackCampaign[]> => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.log("No authenticated user found - returning empty cashback data");
      return [];
    }
    
    // Fetch active campaigns from Supabase
    const campaignsResponse = await fetch(`${SUPABASE_URL}/rest/v1/cashback_campaigns?is_active=eq.true`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    const campaignsData = await campaignsResponse.json();
    
    // Only enhance campaigns if we have any
    if (Array.isArray(campaignsData) && campaignsData.length > 0) {
      return enhanceCampaigns(campaignsData);
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching cashback campaigns:", error);
    return [];
  }
};

/**
 * Enhances campaigns with missing advertiser information
 */
export const enhanceCampaigns = (campaigns: CashbackCampaign[]): CashbackCampaign[] => {
  return (campaigns || []).map((campaign: CashbackCampaign) => {
    // Return campaign as is, since we don't want to add any mock data
    return campaign;
  });
};

/**
 * Fetches the user's cashback balance
 */
export const fetchUserCashbackBalance = async (): Promise<number> => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return 0; // Return 0 instead of mock balance
    }
    
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("points")
      .eq("id", user.id)
      .single();
    
    if (profileError || !profileData) {
      console.log("Error fetching profile or profile not found:", profileError);
      return 0; // Return 0 instead of mock value
    }
    
    // For demonstration, we'll use a portion of points as cashback (10%)
    return Math.round((profileData.points * 0.1) * 100) / 100;
  } catch (error) {
    console.error("Error fetching user cashback balance:", error);
    return 0; // Return 0 instead of mock balance
  }
};

/**
 * Redeems cashback for a specific campaign
 */
export const redeemCashback = async (
  campaignId: string, 
  amount: number
): Promise<CashbackRedemption | null> => {
  try {
    // Check if user is authenticated first
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Você precisa estar logado para resgatar cashback.');
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
      return data as CashbackRedemption;
    } else {
      throw new Error(data.message || 'Erro no resgate de cashback');
    }
  } catch (error: any) {
    console.error("Error redeeming cashback:", error);
    throw error;
  }
};
