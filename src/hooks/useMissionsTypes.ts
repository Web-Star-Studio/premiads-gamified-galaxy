
import { useState, useEffect } from 'react';

export type MissionType = 'form' | 'photo' | 'video' | 'checkin' | 'social' | 'coupon' | 'survey' | 'review';

export interface MissionTypeDetails {
  label: string;
  description: string;
  icon: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  brand?: string;
  type: MissionType;
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
  // Fields for compatibility with old campaign interface
  audience?: string;
  completions?: number;
  reward?: string;
  expires?: string;
  cost_in_tokens?: number; // This is the amount of tokens rewarded to participants
}

export type MissionStatus =
  | "available"
  | "in_progress"
  | "completed"
  | "pending_approval"
  | "pending"; // db string stored for pending submissions

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

export const getMissionTypeDescription = (type: MissionType): string => {
  return missionTypeDescriptions[type] || 'Descrição não disponível';
};

export const getMissionIcon = (type: MissionType): string => {
  // Replace with actual icon paths or components
  return `/icons/${type}.svg`;
};

export const filterMissionsByType = (missions: any[], type: MissionType): any[] => {
  return missions.filter(mission => mission.type === type);
};

export const getMissionDifficulty = (mission: any): string => {
  // Implement logic to determine mission difficulty based on mission properties
  return 'Fácil';
};

export const getEstimatedTime = (mission: any): string => {
  // Implement logic to estimate time based on mission properties
  return '30 minutos';
};

export const useMissionTypes = () => {
  const [missionTypes, setMissionTypes] = useState<MissionType[]>(['form', 'photo', 'video', 'checkin', 'social', 'coupon', 'survey', 'review']);

  useEffect(() => {
    // Fetch mission types from database or API
    // For now, use the hardcoded array above
  }, []);

  return {
    missionTypes,
  };
};
