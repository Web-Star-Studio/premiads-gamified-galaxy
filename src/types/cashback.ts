
// Types for cashback functionality

export interface CashbackCampaign {
  id: string;
  title: string;
  description: string;
  advertiser_name: string;
  advertiser_id: string;
  advertiser_logo: string;
  advertiser_image: string;
  discount_percentage: number;
  conditions: string;
  min_purchase: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  expires_at: string;
}

export interface CashbackRedemption {
  id: string;
  campaign_id: string;
  user_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  code: string;
  created_at: string;
  redeemed_at: string | null;
}

export interface CashbackHook {
  campaigns: CashbackCampaign[];
  userCashback: number;
  loading: boolean;
  redeemCashback: (campaignId: string, amount: number) => Promise<CashbackRedemption | null>;
}
