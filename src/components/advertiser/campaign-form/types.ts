
import { Campaign } from "../campaignData";

/**
 * Props for the CampaignForm component
 */
export interface CampaignFormProps {
  /** Function called when form is closed or submitted */
  onClose: () => void;
  /** Optional campaign data for editing mode */
  editCampaign?: Campaign | null;
}

/**
 * Available mission types for campaigns
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
 * Target audience types
 */
export type AudienceType = "todos" | "novos" | "nivel3";

/**
 * Form data structure for campaign creation/editing
 */
export interface FormData {
  /** Campaign title */
  title: string;
  /** Campaign mission type */
  type: MissionType | "";
  /** Campaign description */
  description: string;
  /** Target audience */
  audience: string;
  /** Points range [min, max] */
  pointsRange: [number, number];
  /** Whether points should be randomly assigned within the range */
  randomPoints: boolean;
  /** Whether campaign awards badges */
  hasBadges: boolean;
  /** Whether campaign includes loot boxes */
  hasLootBox: boolean;
  /** Campaign start date (YYYY-MM-DD) */
  startDate: string;
  /** Campaign end date (YYYY-MM-DD) */
  endDate: string;
  /** Whether campaign has streak bonus */
  streakBonus: boolean;
  /** List of campaign requirements */
  requirements: string[];
}

/**
 * Initial empty state for campaign form
 */
export const initialFormData: FormData = {
  title: "",
  type: "",
  description: "",
  audience: "",
  pointsRange: [30, 50],
  randomPoints: true,
  hasBadges: false,
  hasLootBox: false,
  startDate: "",
  endDate: "",
  streakBonus: false,
  requirements: [],
};

/**
 * Human-readable labels for mission types
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
 * Detailed descriptions for mission types
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
 * Audience type labels for display
 */
export const audienceTypeLabels: Record<string, string> = {
  "todos": "Todos os usuários",
  "novos": "Novos usuários",
  "nivel3": "Usuários nível 3 ou superior"
};
