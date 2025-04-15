
import { Campaign } from "../campaignData";

export interface CampaignFormProps {
  onClose: () => void;
  editCampaign?: Campaign | null;
}

export type MissionType = 
  | "form" 
  | "photo" 
  | "video" 
  | "checkin" 
  | "social" 
  | "coupon" 
  | "survey" 
  | "review";

export interface FormData {
  title: string;
  type: MissionType;
  description: string;
  audience: string;
  pointsRange: [number, number];
  randomPoints: boolean;
  hasBadges: boolean;
  hasLootBox: boolean;
  startDate: string;
  endDate: string;
  streakBonus: boolean;
  requirements: string[];
}

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
