
export interface CreateCashbackInput {
  title: string;
  description: string;
  advertiser_name: string;
  cashback_percentage: number;
  start_date: string;
  end_date: string;
  minimum_purchase?: number; // Tornar opcional para resolver o erro
  category?: string;
}
