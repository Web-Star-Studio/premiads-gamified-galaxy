
import { Campaign } from "../campaignData";

export interface CampaignFormProps {
  onClose: () => void;
  editCampaign?: Campaign | null;
}

export interface FormData {
  title: string;
  type: string;
  audience: string;
  pointsRange: [number, number];
  randomPoints: boolean;
  hasBadges: boolean;
  hasLootBox: boolean;
  startDate: string;
  endDate: string;
  streakBonus: boolean;
}

export const initialFormData: FormData = {
  title: "",
  type: "",
  audience: "",
  pointsRange: [30, 50],
  randomPoints: true,
  hasBadges: false,
  hasLootBox: false,
  startDate: "",
  endDate: "",
  streakBonus: false,
};
