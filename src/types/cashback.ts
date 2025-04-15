
import type { Tables } from "@/integrations/supabase/types";

export type CashbackCampaign = Tables<'cashback_campaigns'>;
export type CashbackRedemption = Tables<'cashback_redemptions'>;

export type CampaignStatus = 'active' | 'expired' | 'upcoming';

export interface CashbackDetails {
  balance: number;
  availableCampaigns: CashbackCampaign[];
}
