
// Campaign form data types
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
  streakBonus: boolean;
  streakMultiplier: number;
  randomPoints: boolean;
  pointsRange: number[];
  pointsValue?: number; // For random points calculation
  targetFilter?: {
    age?: [string, string];
    gender?: string;
    region?: string[];
    interests?: string[]; // Adding missing 'interests' property
  };
  badgeImageUrl?: string | null; // URL to stored badge image
  minPurchase?: number; // Adding missing 'minPurchase' property
}

// Default initial values for campaign form
export const initialFormData: FormData = {
  title: '',
  description: '',
  type: 'form',
  audience: 'all',
  requirements: '',
  startDate: new Date(),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  hasBadges: false,
  hasLootBox: false,
  streakBonus: false,
  streakMultiplier: 1.2,
  randomPoints: false,
  pointsRange: [10, 50],
  targetFilter: {
    age: ["18", "65"],
    gender: "all",
    region: [],
    interests: [] // Initialize interests as empty array
  },
  badgeImageUrl: null,
  minPurchase: 0 // Default value for minPurchase
};
