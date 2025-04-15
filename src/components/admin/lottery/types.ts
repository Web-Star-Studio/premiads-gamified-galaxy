
import { z } from 'zod';

// Schema de validação
export const lotteryFormSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  startDate: z.date({ required_error: 'Data de início é obrigatória' }),
  endDate: z.date({ required_error: 'Data de término é obrigatória' }),
  status: z.enum(['active', 'pending'], { required_error: 'Status é obrigatório' }),
});

export type LotteryFormValues = z.infer<typeof lotteryFormSchema>;

export interface Lottery {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'pending' | 'completed';
  prizes: Array<{
    id: number;
    name: string;
    rarity: string;
    probability: number;
  }>;
}
