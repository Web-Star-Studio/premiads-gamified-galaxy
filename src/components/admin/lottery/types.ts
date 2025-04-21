
export interface Lottery {
  id: string;
  title: string;
  name?: string; // Alias for title to support legacy components
  description: string;
  detailed_description: string | null;
  detailedDescription?: string | null; // Alias for detailed_description
  type: string;
  points: number;
  numbers_total: number;
  numbersTotal?: number; // Alias for numbers_total
  status: 'pending' | 'completed' | 'active' | 'canceled' | 'draft' | 'finished';
  start_date: string;
  startDate?: string; // Alias for start_date
  end_date: string;
  endDate?: string; // Alias for end_date
  draw_date: string;
  drawDate?: string; // Alias for draw_date
  prize_type: string;
  prizeType?: string; // Alias for prize_type
  prize_value: number;
  prizeValue?: number; // Alias for prize_value
  pointsPerNumber?: number; // Points cost per number
  imageUrl?: string; // Add imageUrl property
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
  prizes?: Array<{
    id: number;
    name: string;
    rarity: string;
    probability: number;
  }>;
}

// Add the lottery form schema
import { z } from "zod";

export const lotteryFormSchema = z.object({
  name: z.string().min(3, "Nome é obrigatório e deve ter pelo menos 3 caracteres"),
  description: z.string().min(5, "Descrição é obrigatória"),
  detailedDescription: z.string().optional().nullable(),
  prizeType: z.string().min(1, "Tipo de prêmio é obrigatório"),
  prizeValue: z.number().min(1, "Valor do prêmio é obrigatório"),
  imageUrl: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  status: z.enum(["active", "pending", "completed", "canceled", "draft", "finished"]),
  numbersTotal: z.number().min(1, "Total de números é obrigatório"),
  pointsPerNumber: z.number().min(1, "Pontos por número é obrigatório"),
  minPoints: z.number().optional(),
  isAutoScheduled: z.boolean().default(true),
  drawDate: z.date().optional().nullable(),
  minPointsReachedAt: z.string().optional().nullable(),
});

export type LotteryFormValues = z.infer<typeof lotteryFormSchema>;
