
export interface Campaign {
  id: number;
  title: string;
  status: string;
  audience: string;
  completions: number;
  reward: string;
  expires: string;
}

export const mockCampaigns: Campaign[] = [];

