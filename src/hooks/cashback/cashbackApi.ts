
import { CashbackCampaign, CashbackRedemption } from '@/types/cashback';
import { mockCashbackCampaigns, mockUserCashback, createMockRedemption } from './mockData';

export interface FetchCashbackResult {
  campaigns: CashbackCampaign[];
  userCashback: number;
}

/**
 * Fetches active cashback campaigns using mock data
 * This will be replaced with actual Supabase calls when integrated
 */
export const fetchCashbackCampaigns = async (): Promise<CashbackCampaign[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    // Return mock data
    console.log("Fetching cashback campaigns (mock data)");
    return mockCashbackCampaigns.filter(campaign => campaign.is_active);
  } catch (error) {
    console.error("Error fetching cashback campaigns:", error);
    return [];
  }
};

/**
 * Fetches the user's cashback balance using mock data
 * This will be replaced with actual Supabase calls when integrated
 */
export const fetchUserCashbackBalance = async (): Promise<number> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    console.log("Fetching user cashback balance (mock data)");
    return mockUserCashback;
  } catch (error) {
    console.error("Error fetching user cashback balance:", error);
    return 0;
  }
};

/**
 * Redeems cashback for a specific campaign using mock data
 * This will be replaced with actual Supabase calls when integrated
 */
export const redeemCashback = async (
  campaignId: string, 
  amount: number
): Promise<CashbackRedemption | null> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    // Check if campaign exists
    const campaign = mockCashbackCampaigns.find(c => c.id === campaignId);
    if (!campaign) {
      throw new Error('Campanha não encontrada.');
    }
    
    // Verify balance (using mock data)
    if (mockUserCashback < amount) {
      throw new Error('Saldo insuficiente para realizar este resgate.');
    }
    
    // Create mock redemption
    const redemption = createMockRedemption(campaignId, amount);
    
    console.log("Cashback redeemed (mock):", redemption);
    return redemption;
  } catch (error: any) {
    console.error("Error redeeming cashback:", error);
    throw error;
  }
};
