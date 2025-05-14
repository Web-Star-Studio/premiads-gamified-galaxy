
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
  target_audience?: string;
  points: number;
  cost_in_tokens: number;
  status: "ativa" | "pendente" | "encerrada";
  created_by: string;
  created_at?: string;
  updated_at?: string;
  expires_at?: string;
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
