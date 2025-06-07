
export interface Mission {
  id: string;
  title: string;
  description: string;
  requirements: string[] | string;
  rifas: number;
  cashback_reward: number;
  tickets_reward: number;
  points: number;
  deadline: string;
  type: string;
  business_type: string;
  target_audience_gender: string;
  target_audience_age_min: number;
  target_audience_age_max: number;
  target_audience_region: string;
  start_date: string;
  end_date: string;
  has_badge: boolean;
  has_lootbox: boolean;
  sequence_bonus: boolean;
  badge_image_url?: string;
  selected_lootbox_rewards?: string[];
  status: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  advertiser_id?: string;
}

// Função para converter dados do Supabase para Mission
export function mapSupabaseMissionToMission(dbMission: any): Mission {
  return {
    id: dbMission.id,
    title: dbMission.title,
    description: dbMission.description || '',
    requirements: dbMission.requirements || [],
    rifas: dbMission.rifas || 0,
    cashback_reward: dbMission.cashback_reward || 0,
    tickets_reward: dbMission.rifas || 0, // tickets_reward é igual a rifas
    points: dbMission.rifas || 0, // points é igual a rifas para compatibilidade
    deadline: dbMission.end_date || '',
    type: dbMission.type || '',
    business_type: dbMission.type || '', // business_type é igual a type
    target_audience_gender: dbMission.target_filter?.gender || 'all',
    target_audience_age_min: dbMission.target_filter?.age?.[0] ? parseInt(dbMission.target_filter.age[0]) : 18,
    target_audience_age_max: dbMission.target_filter?.age?.[1] ? parseInt(dbMission.target_filter.age[1]) : 65,
    target_audience_region: dbMission.target_filter?.region?.[0] || '',
    start_date: dbMission.start_date || '',
    end_date: dbMission.end_date || '',
    has_badge: dbMission.has_badge || false,
    has_lootbox: dbMission.has_lootbox || false,
    sequence_bonus: dbMission.sequence_bonus || false,
    badge_image_url: dbMission.badge_image_url,
    selected_lootbox_rewards: dbMission.selected_lootbox_rewards || [],
    status: dbMission.status || 'pendente',
    is_active: dbMission.is_active !== false,
    created_at: dbMission.created_at || '',
    updated_at: dbMission.updated_at || '',
    created_by: dbMission.created_by,
    advertiser_id: dbMission.advertiser_id,
  };
}
