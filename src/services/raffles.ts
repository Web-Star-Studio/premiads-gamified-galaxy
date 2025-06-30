
import { supabase } from '@/integrations/supabase/client';

export interface CreateRaffleParams {
  name: string;
  description: string;
  detailedDescription?: string;
  prizeType: string;
  prizeValue: number;
  startDate: Date;
  endDate: Date;
  drawDate: Date;
  numbersTotal: number;
  pointsPerNumber: number;
  minPoints: number;
  status: 'active' | 'completed' | 'pending' | 'canceled';
  imageUrl?: string;
  numberRange?: { min: number; max: number };
  isAutoScheduled?: boolean;
}

export interface UpdateRaffleParams extends Partial<CreateRaffleParams> {
  id: string;
}

export class RaffleService {
  static async createRaffle(params: CreateRaffleParams) {
    try {
      const { data, error } = await supabase
        .from('lotteries')
        .insert({
          name: params.name,
          description: params.description,
          detailed_description: params.detailedDescription,
          prize_type: params.prizeType,
          prize_value: params.prizeValue,
          start_date: params.startDate.toISOString(),
          end_date: params.endDate.toISOString(),
          draw_date: params.drawDate.toISOString(),
          numbers_total: params.numbersTotal,
          points_per_number: params.pointsPerNumber,
          min_points: params.minPoints,
          status: params.status,
          image_url: params.imageUrl,
          number_range: params.numberRange ? JSON.stringify(params.numberRange) : null,
          is_auto_scheduled: params.isAutoScheduled,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          numbers_sold: 0,
          progress: 0
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating raffle:', error);
      return { data: null, error };
    }
  }

  static async updateRaffle(params: UpdateRaffleParams) {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      // Map camelCase to snake_case for database
      if (params.name !== undefined) updateData.name = params.name;
      if (params.description !== undefined) updateData.description = params.description;
      if (params.detailedDescription !== undefined) updateData.detailed_description = params.detailedDescription;
      if (params.prizeType !== undefined) updateData.prize_type = params.prizeType;
      if (params.prizeValue !== undefined) updateData.prize_value = params.prizeValue;
      if (params.status !== undefined) updateData.status = params.status;
      if (params.imageUrl !== undefined) updateData.image_url = params.imageUrl;
      if (params.startDate !== undefined) updateData.start_date = params.startDate.toISOString();
      if (params.endDate !== undefined) updateData.end_date = params.endDate.toISOString();
      if (params.drawDate !== undefined) updateData.draw_date = params.drawDate.toISOString();
      if (params.numbersTotal !== undefined) updateData.numbers_total = params.numbersTotal;
      if (params.pointsPerNumber !== undefined) updateData.points_per_number = params.pointsPerNumber;
      if (params.minPoints !== undefined) updateData.min_points = params.minPoints;
      if (params.numberRange !== undefined) updateData.number_range = params.numberRange ? JSON.stringify(params.numberRange) : null;
      if (params.isAutoScheduled !== undefined) updateData.is_auto_scheduled = params.isAutoScheduled;

      const { data, error } = await supabase
        .from('lotteries')
        .update(updateData)
        .eq('id', params.id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating raffle:', error);
      return { data: null, error };
    }
  }

  static async getRaffleById(id: string) {
    try {
      const { data, error } = await supabase
        .from('lotteries')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching raffle by ID:', error);
      return { data: null, error };
    }
  }

  static async getAllRaffles() {
    try {
      const { data, error } = await supabase
        .from('lotteries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching all raffles:', error);
      return { data: null, error };
    }
  }

  static async getRaffles() {
    return this.getAllRaffles();
  }

  static async getActiveRaffles() {
    try {
      const { data, error } = await supabase
        .from('lotteries')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching active raffles:', error);
      return { data: [], error };
    }
  }

  static async getUserWonRaffles(userId: string) {
    try {
      const { data, error } = await supabase
        .from('lottery_winners')
        .select(`
          *,
          lotteries (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching user won raffles:', error);
      return { data: [], error };
    }
  }

  static async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { data: null, error };
    }
  }

  static async deleteRaffle(id: string) {
    try {
      const { data, error } = await supabase
        .from('lotteries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error deleting raffle:', error);
      return { data: null, error };
    }
  }
}

export const raffleService = new RaffleService();
export default raffleService;
