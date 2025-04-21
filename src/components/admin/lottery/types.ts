
export interface Lottery {
  id: string;
  title: string;
  description: string;
  detailed_description: string | null;
  type: string;
  points: number;
  numbers_total: number;
  status: 'pending' | 'completed' | 'active' | 'canceled' | 'draft' | 'finished';
  start_date: string;
  end_date: string;
  draw_date: string;
  prize_type: string;
  prize_value: number;
  winner: {
    id: string;
    name: string;
    avatar: string;
  } | null;
  created_at: string;
  updated_at: string;
  numbers: Array<{ id: string }>;
  progress: number;
  numbersSold: number;
}
