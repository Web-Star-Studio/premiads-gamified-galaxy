// Campaign form data types
import { LootBoxRewardType } from "../LootBoxRewardsSelector";

// Dynamic form field definitions for survey builder
export interface FormField {
  id: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'file'
  options?: string[]
}

export interface FormData {
  title: string;
  description: string;
  type: string;
  audience: string;
  requirements: string | string[];
  startDate: Date | string;
  endDate: Date | string;
  hasBadges: boolean;
  hasLootBox: boolean;
  /** Extra prize (formerly loot box) enable flag */
  hasExtraPrize?: boolean;
  streakBonus: boolean;
  streakMultiplier: number;
  randomPoints: boolean;
  pointsRange: number[];
  pointsValue?: number; // For random points calculation
  /** Novo campo – tickets distribuídos por missão */
  ticketsReward: number;
  /** Novo campo – cashback por missão (R$) */
  cashbackReward: number;
  /** Número máximo de participantes da campanha */
  maxParticipants?: number;
  /** Número máximo de resgates de cashback */
  maxCashbackRedemptions?: number;
  /** Valor do cashback por rifa (em reais) */
  cashbackAmountPerRaffle?: number;
  targetFilter?: {
    age?: [string, string];
    gender?: string;
    region?: string[];
    interests?: string[]; // Adding missing 'interests' property
  };
  badgeImageUrl?: string | null; // URL to stored badge image
  extraPrizeName?: string;
  extraPrizeDescription?: string;
  extraPrizeImageUrl?: string | null;
  minPurchase?: number; // Adding missing 'minPurchase' property
  selectedLootBoxRewards?: LootBoxRewardType[]; // Array of selected loot box reward types
  /** Dynamic survey form schema */
  formSchema?: FormField[]
}

// Default initial values for campaign form
export const initialFormData: FormData = {
  title: '',
  description: '',
  type: '',
  audience: 'all',
  requirements: '',
  startDate: new Date(),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  hasBadges: false,
  hasLootBox: false,
  hasExtraPrize: false,
  streakBonus: false,
  streakMultiplier: 1.2,
  randomPoints: false,
  pointsRange: [10, 50],
  pointsValue: 10, // initial manual points value
  ticketsReward: 0,
  cashbackReward: 0,
  maxParticipants: 100, // Valor inicial para máximo de participantes
  maxCashbackRedemptions: 5,
  cashbackAmountPerRaffle: 5.00, // Valor fixo de R$ 5,00 por rifa
  targetFilter: {
    age: ["18", "65"],
    gender: "all",
    region: [],
    interests: [] // Initialize interests as empty array
  },
  badgeImageUrl: null,
  extraPrizeName: '',
  extraPrizeDescription: '',
  extraPrizeImageUrl: null,
  minPurchase: 0, // Default value for minPurchase
  selectedLootBoxRewards: ['credit_bonus', 'random_badge', 'multiplier', 'level_up', 'daily_streak_bonus', 'raffle_ticket'] as LootBoxRewardType[],
  formSchema: []
};
