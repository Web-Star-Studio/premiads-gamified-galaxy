import { z } from 'zod';

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
  image_url?: string;
  start_date: string;
  startDate: string;
  end_date: string;
  endDate: string;
  draw_date: string;
  drawDate: string;
  status: 'active' | 'pending' | 'completed' | 'canceled';
  numbers_total: number;
  numbersTotal: number;
  tickets_reward: number;
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
  /**
   * Number range configuration for the lottery
   */
  number_range?: {
    min: number;
    max: number;
  };
  /**
   * When true, the raffle will be automatically drawn after either selling out
   * or reaching the minimum number of tickets (72h after start date).
   */
  isAutoScheduled?: boolean;
  /**
   * The winning number after the draw is complete
   */
  winning_number?: number;
}

export const lotteryFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  detailedDescription: z.string().min(1, "Descrição detalhada é obrigatória"),
  prizeType: z.string().min(1, "Tipo de prêmio é obrigatório"),
  prizeValue: z.number().min(0, "Valor do prêmio deve ser positivo"),
  imageUrl: z.string().optional(),
  imageFile: z.instanceof(File).optional(),
  startDate: z.date(),
  endDate: z.date(),
  drawDate: z.date().optional(),
  status: z.enum(['active', 'pending', 'completed', 'canceled']),
  numbersTotal: z.number().min(1, "Total de números deve ser positivo"),
  pointsPerNumber: z.number().min(1, "Pontos por número deve ser positivo"),
  minPoints: z.number().min(0, "Pontos mínimos deve ser positivo"),
  // Number range
  numberRange: z.object({
    min: z.number().min(1),
    max: z.number().min(1)
  }).refine(data => data.max > data.min, {
    message: "O número máximo deve ser maior que o mínimo",
    path: ["max"]
  }),
  // Toggle for automatic scheduling
  isAutoScheduled: z.boolean().default(true)
});

export type LotteryFormValues = z.infer<typeof lotteryFormSchema>;

export interface LotteryParticipation {
  id: string;
  user_id: string;
  lottery_id: string;
  numbers: number[];
  created_at: string;
  updated_at: string;
}

export interface LotteryWinner {
  id: string;
  lottery_id: string;
  user_id: string;
  winning_number: number;
  prize_name: string;
  prize_value: number;
  created_at: string;
}
