export interface CashbackCampaign {
  id: string
  advertiser_id: string
  title: string
  description: string
  discount_percentage: number // 5–100
  minimum_purchase: number | null // null se 100%
  end_date: string
  category: string
  advertiser_logo: string
  is_active: boolean
  created_at: string
}

export type CreateCashbackInput = Omit<CashbackCampaign, 'id' | 'created_at'> 