
export interface Campaign {
  id: string | number;
  title: string;
  status: string;
  audience: string;
  completions: number;
  reward: string;
  expires: string;
}

export const mockCampaigns: Campaign[] = [];

