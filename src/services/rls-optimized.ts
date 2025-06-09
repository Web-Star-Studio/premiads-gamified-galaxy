import { supabase } from '@/integrations/supabase/client';

export type TransactionType = 'purchase_rifas' | 'earn_rifas' | 'earn_cashback' | 'spend_rifas';

export interface TransactionData {
  user_id: string;
  type: TransactionType;
  amount: number;
  metadata?: any;
}

export const createTransaction = async (data: TransactionData) => {
  try {
    const { data: result, error } = await supabase
      .from('transactions')
      .insert([{
        user_id: data.user_id,
        type: data.type as TransactionType,
        amount: data.amount,
        metadata: data.metadata || {}
      }])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: result };
  } catch (error) {
    console.error('Error creating transaction:', error);
    return { success: false, error };
  }
};
