
export interface CashbackCampaign {
  id: string
  title: string
  description: string
  cashback_percentage: number // Fixed: Keep as cashback_percentage
  min_purchase: number | null // Fixed: Updated from minimum_purchase
  end_date: string
  category: string
  advertiser_logo: string
  advertiser_name?: string
  advertiser_id: string
  is_active: boolean
  created_at: string
  updated_at: string
  start_date: string
  expires_at?: string
}

export interface CreateCashbackInput {
  title: string
  description: string
  cashback_percentage: number // Fixed: Keep as cashback_percentage
  min_purchase: number | null // Fixed: Updated field name
  end_date: string
  category: string
  advertiser_logo: string
  advertiser_id: string
  is_active: boolean
}
