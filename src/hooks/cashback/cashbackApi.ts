
import { supabase } from '@/integrations/supabase/client';
import { CashbackCampaign, CashbackRedemption } from '@/types/cashback';

export interface FetchCashbackResult {
  campaigns: CashbackCampaign[];
  userCashback: number;
}

/**
 * Fetches active cashback campaigns from the Supabase database
 */
export const fetchCashbackCampaigns = async (): Promise<CashbackCampaign[]> => {
  try {
    // Check for auth session
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      console.log("No authenticated session found - returning empty cashback data");
      return [];
    }
    
    // Fetch active campaigns from Supabase
    const { data: campaignsData, error: campaignsError } = await supabase
      .from('cashback_campaigns')
      .select('*')
      .eq('is_active', true);
    
    if (campaignsError) {
      console.error("Error fetching cashback campaigns:", campaignsError);
      throw campaignsError;
    }
    
    return campaignsData || [];
  } catch (error) {
    console.error("Error fetching cashback campaigns:", error);
    return [];
  }
};

/**
 * Fetches the user's cashback balance
 */
export const fetchUserCashbackBalance = async (): Promise<number> => {
  try {
    // Check for auth session
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      console.log("No authenticated session found - returning zero cashback balance");
      return 0;
    }
    
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("points")
      .eq("id", session.user.id)
      .single();
    
    if (profileError) {
      console.log("Error fetching profile or profile not found:", profileError);
      return 0;
    }
    
    // For demonstration, we'll use a portion of points as cashback (10%)
    return Math.round((profileData?.points || 0) * 0.1 * 100) / 100;
  } catch (error) {
    console.error("Error fetching user cashback balance:", error);
    return 0;
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
    // Check for auth session
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      throw new Error('Você precisa estar logado para resgatar cashback.');
    }
    
    // First verify if the user has enough balance
    const currentBalance = await fetchUserCashbackBalance();
    if (currentBalance < amount) {
      throw new Error('Saldo insuficiente para realizar este resgate.');
    }
    
    // Insert redemption record
    const { data, error } = await supabase
      .from('cashback_redemptions')
      .insert({
        campaign_id: campaignId,
        user_id: session.user.id,
        amount: amount,
        status: 'pending',
        code: `CB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error redeeming cashback:", error);
      throw error;
    }
    
    // Deduct points from user profile (10x because cashback is 10% of points)
    const pointsToDeduct = amount * 10;
    
    // Fix: Get the current points and calculate the new value
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', session.user.id)
      .single();
    
    if (profileError) {
      console.error("Error getting user profile:", profileError);
      throw profileError;
    }
    
    const currentPoints = profileData?.points || 0;
    const newPoints = currentPoints - pointsToDeduct;
    
    // Update with the calculated value
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ points: newPoints })
      .eq('id', session.user.id);
    
    if (updateError) {
      console.error("Error updating user points:", updateError);
      throw updateError;
    }
    
    return data;
  } catch (error: any) {
    console.error("Error redeeming cashback:", error);
    throw error;
  }
};
