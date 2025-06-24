export interface CashbackCampaign {
  id: string;
  title: string;
  description?: string;
  advertiser_name?: string;
  advertiser_logo?: string;
  cashback_percentage: number;
  discount_percentage: number; // Add this for compatibility
  category?: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CashbackRedemption {
  id: string;
  campaign_id: string;
  user_id: string;
  amount: number;
  code?: string;
  status: string;
  redeemed_at?: string;
  created_at: string;
}

// Input types for forms
export interface CreateCashbackInput {
  title: string;
  description?: string;
  cashback_percentage: number;
  category?: string;
  start_date: string;
  end_date: string;
  advertiser_id: string;
}
