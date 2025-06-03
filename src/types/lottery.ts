
export interface Lottery {
  id: string;
  title: string;
  name: string;
  description: string;
  detailed_description: string;
  detailedDescription: string;
  prize_type: string;
  prizeType: string;
  prize_value: number;
  prizeValue: number;
  imageUrl?: string;
  start_date: string;
  startDate: string;
  end_date: string;
  endDate: string;
  draw_date: string;
  drawDate: string;
  status: 'active' | 'pending' | 'completed' | 'canceled';
  numbers_total: number;
  numbersTotal: number;
  points: number;
  type: string;
  pointsPerNumber: number;
  minPoints: number;
  numbers: any[];
  created_at: string;
  updated_at: string;
  progress: number;
  numbersSold: number;
  winner: any;
  prizes: Array<{
    id: number;
    name: string;
    rarity: string;
    probability: number;
  }>;
}
