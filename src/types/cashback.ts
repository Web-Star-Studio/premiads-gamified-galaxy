
export interface CashbackCampaign {
  id: string;
  advertiser_id: string;
  title: string;
  description: string | null;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  minimum_purchase: number | null;
  maximum_discount: number | null;
  is_active: boolean;
  conditions: string | null;
  created_at: string;
  updated_at: string;
}

export interface CashbackRedemption {
  id: string;
  user_id: string;
  campaign_id: string;
  amount: number;
  status: string;
  code: string;
  redeemed_at: string | null;
  created_at: string;
  updated_at: string;
}

export type CampaignStatus = 'active' | 'expired' | 'upcoming';

export interface CashbackDetails {
  balance: number;
  availableCampaigns: CashbackCampaign[];
}
