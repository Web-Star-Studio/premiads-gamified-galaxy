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
   * When true, the raffle will be automatically drawn after either selling out
   * or reaching the minimum number of tickets (48 h cooldown).  Used only on
   * the admin form UI – not persisted in the DB.
   */
  isAutoScheduled?: boolean;
}

export const lotteryFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  detailedDescription: z.string().min(1, "Descrição detalhada é obrigatória"),
  prizeType: z.string().min(1, "Tipo de prêmio é obrigatório"),
  prizeValue: z.number().min(0, "Valor do prêmio deve ser positivo"),
  imageUrl: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  drawDate: z.date().optional(),
  status: z.enum(['active', 'pending', 'completed', 'canceled']),
  numbersTotal: z.number().min(1, "Total de números deve ser positivo"),
  pointsPerNumber: z.number().min(1, "Pontos por número deve ser positivo"),
  minPoints: z.number().min(0, "Pontos mínimos deve ser positivo"),
  // Toggle for automatic scheduling
  isAutoScheduled: z.boolean().default(false)
});

export type LotteryFormValues = z.infer<typeof lotteryFormSchema>;
