
import { z } from 'zod';

// Schema de validação
export const lotteryFormSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  description: z.string().min(10, { message: 'Descrição deve ter pelo menos 10 caracteres' }),
  detailedDescription: z.string().min(20, { message: 'Descrição detalhada deve ter pelo menos 20 caracteres' }),
  prizeType: z.string({ required_error: 'Tipo de prêmio é obrigatório' }),
  prizeValue: z.number().min(1, { message: 'Valor do prêmio deve ser maior que zero' }),
  imageUrl: z.string().url({ message: 'URL da imagem inválida' }),
  startDate: z.date({ required_error: 'Data de início é obrigatória' }),
  endDate: z.date({ required_error: 'Data de término é obrigatória' }),
  drawDate: z.date({ required_error: 'Data do sorteio é obrigatória' }),
  status: z.enum(['active', 'pending', 'completed', 'canceled'], { required_error: 'Status é obrigatório' }),
  numbersTotal: z.number().int().min(1, { message: 'Total de números deve ser maior que zero' }),
  pointsPerNumber: z.number().int().min(1, { message: 'Pontos por número deve ser maior que zero' }),
  minPoints: z.number().int().min(0, { message: 'Pontuação mínima não pode ser negativa' }),
});

export type LotteryFormValues = z.infer<typeof lotteryFormSchema>;

export interface Lottery {
  id: number;
  name: string;
  description: string;
  detailedDescription: string;
  prizeType: string;
  prizeValue: number;
  imageUrl: string;
  startDate: string;
  endDate: string;
  drawDate: string;
  status: 'active' | 'pending' | 'completed' | 'canceled';
  numbersTotal: number;
  pointsPerNumber: number;
  minPoints: number;
  progress?: number; // Percentage of tickets sold
  numbersSold?: number; // Number of tickets sold
  prizes: Array<{
    id: number;
    name: string;
    rarity: string;
    probability: number;
  }>;
  winner?: {
    id: number;
    name: string;
    avatar: string;
  };
}
