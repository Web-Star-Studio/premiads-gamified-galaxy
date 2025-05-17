
import { MissionStatus } from "./missions/types";

/**
 * Mission types available in the system
 */
export type MissionType = 
  | "form"    // Form filling missions
  | "photo"   // Photo upload missions 
  | "video"   // Video upload missions
  | "checkin" // Location check-in missions
  | "social"  // Social media sharing missions
  | "coupon"  // Discount coupon missions
  | "survey"  // Survey completion missions
  | "review"; // Product/service review missions

/**
 * Available mission types with their translations
 */
export const MISSION_TYPES: Record<MissionType, string> = {
  form: "Formulário",
  photo: "Foto",
  video: "Vídeo",
  checkin: "Check-in",
  social: "Redes Sociais",
  coupon: "Cupom de Desconto",
  survey: "Pesquisa",
  review: "Avaliação"
};

/**
 * Mission type descriptions
 */
export const MISSION_TYPE_DESCRIPTIONS: Record<MissionType, string> = {
  form: "Preencher um formulário",
  photo: "Enviar uma foto",
  video: "Enviar um vídeo",
  checkin: "Fazer check-in em um local",
  social: "Compartilhar nas redes sociais",
  coupon: "Usar um cupom de desconto",
  survey: "Responder a uma pesquisa",
  review: "Deixar uma avaliação"
};

/**
 * Human-readable labels for mission types (for UI display)
 */
export const missionTypeLabels: Record<MissionType, string> = {
  form: "Formulário",
  photo: "Foto",
  video: "Vídeo",
  checkin: "Check-in",
  social: "Redes Sociais",
  coupon: "Cupom de Desconto",
  survey: "Pesquisa",
  review: "Avaliação Online"
};

/**
 * Detailed descriptions for mission types (for campaign creation)
 */
export const missionTypeDescriptions: Record<MissionType, string> = {
  form: "Solicite aos clientes que preencham um formulário no seu site ou outro local.",
  photo: "Peça aos clientes que tirem e enviem fotos de produtos, locais ou experiências.",
  video: "Solicite aos clientes que gravem e enviem vídeos relacionados ao seu produto ou serviço.",
  checkin: "Os clientes fazem check-in em uma localização física específica.",
  social: "Incentive clientes a fazer postagens em redes sociais mencionando sua marca.",
  coupon: "Os clientes usam um cupom de desconto para comprar seus produtos ou serviços.",
  survey: "Os clientes respondem a uma pesquisa detalhada sobre suas preferências ou hábitos.",
  review: "Clientes deixam avaliações genuínas em plataformas de reviews para seu negócio."
};

/**
 * Get a human-readable description for a mission type
 */
export const getMissionTypeDescription = (type: MissionType): string => 
  MISSION_TYPE_DESCRIPTIONS[type] || "";

/**
 * Get icon for a mission type
 */
export const getMissionIcon = (type: MissionType): string => {
  const icons: Record<MissionType, string> = {
    form: "form",
    photo: "camera",
    video: "videocam",
    checkin: "location",
    social: "share",
    coupon: "card",
    survey: "clipboard",
    review: "star"
  };
  return icons[type] || "help";
};

/**
 * Filter missions by type
 */
export const filterMissionsByType = (missions: any[], type: MissionType | "all"): any[] => {
  if (type === "all") return missions;
  return missions.filter(mission => mission.type === type);
};

/**
 * Get mission difficulty level (1-3)
 */
export const getMissionDifficulty = (mission: any): number => {
  const pointsMap: Record<MissionType, number> = {
    form: 1,
    photo: 2,
    video: 3,
    checkin: 1,
    social: 2,
    coupon: 2,
    survey: 2,
    review: 2
  };
  
  return pointsMap[mission.type as MissionType] || 1;
};

/**
 * Get estimated time to complete a mission (in minutes)
 */
export const getEstimatedTime = (mission: any): number => {
  const timeMap: Record<MissionType, number> = {
    form: 5,
    photo: 10,
    video: 15,
    checkin: 5,
    social: 10,
    coupon: 15,
    survey: 10,
    review: 10
  };
  
  return timeMap[mission.type as MissionType] || 5;
};

/**
 * Hook for using mission types with their labels
 */
export const useMissionTypes = () => {
  return {
    types: Object.keys(MISSION_TYPES) as MissionType[],
    labels: MISSION_TYPES,
    descriptions: MISSION_TYPE_DESCRIPTIONS,
    getMissionTypeDescription,
    getMissionIcon,
    getMissionDifficulty,
    getEstimatedTime
  };
};

/**
 * Mission submission types
 */
export interface MissionSubmission {
  id: string;
  mission_id: string;
  user_id: string;
  proof_url?: string[];
  proof_text?: string;
  status: "pendente" | "aprovado" | "rejeitado" | "segunda_instancia" | "descartado";
  validated_by?: string;
  admin_validated?: boolean;
  feedback?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Mission data structure
 */
export interface Mission {
  id: string;
  title: string;
  description: string;
  type: MissionType;
  requirements?: string | string[];
  points: number;
  cost_in_tokens: number;
  status: "ativa" | "pendente" | "encerrada";
  created_by: string;
  created_at?: string;
  updated_at?: string;
  start_date?: string;
  end_date?: string;
  streak_bonus?: boolean;
  streak_multiplier?: number;
  target_audience_age_min?: number;
  target_audience_age_max?: number;
  target_audience_region?: string;
  target_audience_gender?: string;
}

/**
 * User tokens data structure
 */
export interface UserTokens {
  id?: string;
  user_id: string;
  total_tokens: number;
  used_tokens: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Mission validation log entry
 */
export interface ValidationLog {
  id?: string;
  submission_id: string;
  validated_by: string;
  is_admin: boolean;
  result: "aprovado" | "rejeitado";
  notes?: string;
  created_at?: string;
}

/**
 * Mission reward data structure
 */
export interface MissionReward {
  id?: string;
  user_id: string;
  mission_id: string;
  submission_id: string;
  points_earned: number;
  rewarded_at?: string;
}
