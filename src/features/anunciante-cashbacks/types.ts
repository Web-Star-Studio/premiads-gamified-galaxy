export interface CashbackCampaign {
  id: string;
  title: string;
  description: string;
  cashback_percentage: number;
  start_date?: string;
  end_date: string;
  category: string;
  advertiser_id: string;
  advertiser_name?: string;
  advertiser_logo: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  expires_at?: string;
}

export interface CreateCashbackInput {
  title: string;
  description: string;
  cashback_percentage: number;
  end_date: string;
  category: string;
  advertiser_id: string;
  advertiser_logo: string;
  is_active: boolean;
}
