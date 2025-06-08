
export interface FormData {
  title: string;
  description: string;
  type: string;
  audience: string;
  requirements: string;
  startDate: Date;
  endDate: Date;
  hasBadges: boolean;
  hasLootBox: boolean;
  streakBonus: boolean;
  streakMultiplier: number;
  rifas: number;
  cashbackReward: number;
  maxParticipants: number;
  cashbackAmountPerRaffle: number;
  targetFilter: Record<string, any>;
  badgeImageUrl: string | null;
  minPurchase: number;
  selectedLootBoxRewards: string[];
  formSchema: any[];
}

export const initialFormData: FormData = {
  title: '',
  description: '',
  type: '',
  audience: 'all',
  requirements: '',
  startDate: new Date(),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  hasBadges: false,
  hasLootBox: false,
  streakBonus: false,
  streakMultiplier: 1.2,
  rifas: 10,
  cashbackReward: 0,
  maxParticipants: 100,
  cashbackAmountPerRaffle: 5.00,
  targetFilter: {},
  badgeImageUrl: null,
  minPurchase: 0,
  selectedLootBoxRewards: [],
  formSchema: []
};
