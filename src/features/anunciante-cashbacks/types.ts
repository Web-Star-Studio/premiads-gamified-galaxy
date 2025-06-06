
export interface CashbackCampaign {
  id: string
  title: string
  description: string
  cashback_percentage: number // Renomeado de discount_percentage
  min_purchase: number | null
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
  cashback_percentage: number // Atualizado
  minimum_purchase: number | null
  end_date: string
  category: string
  advertiser_logo: string
  advertiser_id: string
  is_active: boolean
}
