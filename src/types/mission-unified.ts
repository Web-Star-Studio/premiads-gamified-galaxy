// Define mission types for consistency across the app
export interface Mission {
  id: string;
  title: string;
  description: string;
  type: MissionType;
  tickets_reward: number;
  cashback_reward: number;
  cost_in_tokens: number;
  requirements: string[] | string;
  status: string;
  start_date: string;
  end_date: string;
  advertiser_id?: string;
  created_by?: string;
  is_active?: boolean;
  streak_bonus?: boolean;
  streak_multiplier?: number;
  target_audience?: string;
  target_audience_gender?: string;
  target_audience_age_min?: number;
  target_audience_age_max?: number;
  target_audience_region?: string;
  target_filter?: any;
  created_at?: string;
  updated_at?: string;
  deadline?: string;
  has_badge?: boolean;
  has_lootbox?: boolean;
  brand?: string;
  rifas?: number;
}

export type MissionType = 'form' | 'photo' | 'video' | 'checkin' | 'social' | 'coupon' | 'survey' | 'review';

export interface MissionSubmission {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  mission_id: string;
  mission_title: string;
  submission_data: any;
  feedback?: string;
  status: 'pending' | 'approved' | 'rejected' | 'second_instance_pending' | 'returned_to_advertiser';
  submitted_at: string;
  updated_at: string;
  second_instance?: boolean;
  review_stage?: string;
  second_instance_status?: string;
}

export interface Submission extends MissionSubmission {
  missions?: {
    title: string;
  };
  proof_url?: string[];
  proof_text?: string;
  user?: {
    name: string;
    avatar_url?: string;
    id: string;
  };
}

export interface User {
  id: string;
  name: string;
  avatar_url?: string;
  email?: string;
}

export interface UserTokens {
  user_id: string;
  total_tokens: number;
  used_tokens: number;
  updated_at: string;
}

export interface ValidationLog {
  id: string;
  submission_id: string;
  validated_by: string;
  is_admin: boolean;
  result: string;
  notes?: string;
  created_at: string;
}

export interface MissionReward {
  id: string;
  user_id: string;
  mission_id: string;
  submission_id: string;
  points_earned: number;
  rewarded_at: string;
}

export const missionTypeLabels: Record<MissionType, string> = {
  form: 'Formulário',
  photo: 'Envio de Foto',
  video: 'Envio de Vídeo',
  checkin: 'Check-in Local',
  social: 'Ação Social',
  coupon: 'Uso de Cupom',
  survey: 'Pesquisa',
  review: 'Avaliação de Produto/Serviço'
};

export const missionTypeDescriptions: Record<MissionType, string> = {
  form: 'Preencha um formulário com as informações solicitadas.',
  photo: 'Envie uma foto conforme os requisitos da missão.',
  video: 'Grave e envie um vídeo seguindo as diretrizes.',
  checkin: 'Faça check-in em um local específico.',
  social: 'Realize uma ação em suas redes sociais (curtir, compartilhar, comentar).',
  coupon: 'Utilize um cupom de desconto em uma compra ou serviço.',
  survey: 'Responda a uma pesquisa de opinião ou mercado.',
  review: 'Escreva uma avaliação sobre um produto ou serviço.'
};

/**
 * Determines mission difficulty based on tickets_reward or other criteria.
 */
export function getMissionDifficulty(mission: Pick<Mission, 'tickets_reward' | 'type' | 'requirements'>): string {
  if (mission.tickets_reward > 150) return 'Difícil';
  if (mission.tickets_reward > 75) return 'Médio';
  return 'Fácil';
}

/**
 * Estimates completion time for a mission.
 */
export function getEstimatedTime(mission: Pick<Mission, 'type' | 'requirements'>): string {
  switch (mission.type) {
    case 'form':
    case 'survey':
      return '5-10 min';
    case 'photo':
    case 'checkin':
    case 'social':
      return '2-5 min';
    case 'video':
    case 'review':
      return '10-15 min';
    case 'coupon':
      return 'Varia conforme compra';
    default:
      return 'Não estimado';
  }
}
