
// Mission types and status definitions
export type MissionStatus =
  | "available"
  | "in_progress"
  | "completed"
  | "pending_approval"
  | "pending" // db string stored for pending submissions
  | "approved"
  | "rejected"
  | "second_instance_pending"
  | "returned_to_advertiser";

export interface Mission {
  id: string;
  title: string;
  description: string;
  brand?: string;
  type: import("@/hooks/useMissionsTypes").MissionType;
  points: number;
  deadline?: string;
  status: MissionStatus;
  requirements?: string[];
  business_type?: string;
  target_audience_gender?: string;
  target_audience_age_min?: number;
  target_audience_age_max?: number;
  target_audience_region?: string;
  // Reward related fields
  has_badges?: boolean;
  has_lootbox?: boolean;
  streak_bonus?: boolean;
  streak_multiplier?: number;
  // Target filter data
  target_filter?: any;
  // Min purchase for coupon campaigns
  min_purchase?: number;
  // Date fields
  start_date?: string;
  end_date?: string;
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
  // Fields for backwards compatibility with existing components
  audience?: string; // Mapped from target_audience
  reward?: number; // Mapped from points
  expires?: string; // Mapped from expires_at
  completions?: number; // To support CampaignTableRow
  cost_in_tokens?: number;
}

export interface UseMissionsOptions {
  initialFilter?: "available" | "in_progress" | "pending" | "completed";
}

// Helper functions that were expected by imports
export const missionTypeLabels: Record<string, string> = {
  form: 'Formulário',
  photo: 'Envio de Foto',
  video: 'Envio de Vídeo',
  checkin: 'Check-in Local',
  social: 'Ação Social',
  coupon: 'Uso de Cupom',
  survey: 'Pesquisa',
  review: 'Avaliação de Produto/Serviço'
};

export const missionTypeDescriptions: Record<string, string> = {
  form: 'Preencha um formulário com as informações solicitadas.',
  photo: 'Envie uma foto conforme os requisitos da missão.',
  video: 'Grave e envie um vídeo seguindo as diretrizes.',
  checkin: 'Faça check-in em um local específico.',
  social: 'Realize uma ação em suas redes sociais (curtir, compartilhar, comentar).',
  coupon: 'Utilize um cupom de desconto em uma compra ou serviço.',
  survey: 'Responda a uma pesquisa de opinião ou mercado.',
  review: 'Escreva uma avaliação sobre um produto ou serviço.'
};

export function getMissionDifficulty(mission: Pick<Mission, 'points' | 'type' | 'requirements'>): string {
  if (mission.points > 150) return 'Difícil';
  if (mission.points > 75) return 'Médio';
  return 'Fácil';
}

export function getEstimatedTime(mission: Pick<Mission, 'type' | 'requirements'>): string {
  const missionType = mission.type as string;
  switch (missionType) {
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

export function getMissionTypeDescription(type: string): string {
  return missionTypeDescriptions[type] || 'Descrição não disponível';
}

export function getMissionIcon(type: string): string {
  // This is a stub function to satisfy imports
  return 'award';
}

export function filterMissionsByType(missions: Mission[], type: string): Mission[] {
  if (type === 'all') return missions;
  return missions.filter(mission => mission.type === type);
}

// This is a stub type to satisfy imports
export type useMissionTypes = () => {
  types: string[];
  selectedType: string;
  setSelectedType: (type: string) => void;
};
