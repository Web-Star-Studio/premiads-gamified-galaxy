
export interface CashbackCampaign {
  id: string;
  title: string;
  description: string;
  advertiser_name: string;
  advertiser_logo?: string;
  cashback_percentage: number;
  discount_percentage?: number;
  start_date: string;
  end_date: string;
  minimum_purchase?: number;
  category?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  advertiser_id?: string;
}

export interface CreateCashbackInput {
  title: string;
  description: string;
  advertiser_name: string;
  advertiser_id?: string;
  advertiser_logo?: string;
  cashback_percentage: number;
  start_date: string;
  end_date: string;
  minimum_purchase?: number;
  category?: string;
  is_active?: boolean;
}
