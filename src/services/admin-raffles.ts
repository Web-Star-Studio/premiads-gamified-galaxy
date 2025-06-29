import { supabase } from '@/integrations/supabase/client';
import { Lottery, LotteryFormValues } from '@/types/lottery';

// Service para operações administrativas de sorteios via Edge Function
class AdminRaffleService {
  private async callEdgeFunction(action: string, data: any) {
    const { data: result, error } = await supabase.functions.invoke('admin-lottery-operations', {
      body: { action, data }
    });

    if (error) {
      console.error(`Error calling admin-lottery-operations with action ${action}:`, error);
      throw new Error(error.message || 'Failed to perform admin operation');
    }

    return result;
  }

  async createRaffle(values: LotteryFormValues, imageFile?: File): Promise<Lottery> {
    try {
      let imageUrl = '';

      // Upload da imagem se fornecida
      if (imageFile) {
        const fileExtension = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExtension}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('raffle-images')
          .upload(fileName, imageFile);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          throw new Error('Erro ao fazer upload da imagem');
        }

        // Gerar URL pública da imagem
        const { data: { publicUrl } } = supabase.storage
          .from('raffle-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      // Helper function to transform form data to database structure
      const transformedData = {
        name: values.name,
        description: values.description,
        detailedDescription: values.detailedDescription,
        prizeType: values.prizeType,
        prizeValue: values.prizeValue,
        imageUrl,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        status: values.status,
        numbersTotal: values.numbersTotal,
        pointsPerNumber: values.pointsPerNumber,
        minPoints: values.minPoints,
        numberRange: values.numberRange,
      };

      const result = await this.callEdgeFunction('create', transformedData);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create raffle');
      }

      return result.lottery;
    } catch (error) {
      console.error('Error creating raffle:', error);
      throw error;
    }
  }

  async updateRaffleStatus(raffleId: string, newStatus: Lottery['status']): Promise<Lottery> {
    try {
      const result = await this.callEdgeFunction('updateStatus', {
        id: raffleId,
        status: newStatus
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to update raffle status');
      }

      return result.lottery;
    } catch (error) {
      console.error('Error updating raffle status:', error);
      throw error;
    }
  }

  async deleteRaffle(raffleId: string): Promise<boolean> {
    try {
      const result = await this.callEdgeFunction('delete', {
        id: raffleId
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete raffle');
      }

      return true;
    } catch (error) {
      console.error('Error deleting raffle:', error);
      throw error;
    }
  }

  async updateRaffle(lotteryId: string, updates: Partial<Lottery>): Promise<Lottery> {
    try {
      const result = await this.callEdgeFunction('update', {
        id: lotteryId,
        ...updates
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to update raffle');
      }

      return result.lottery;
    } catch (error) {
      console.error('Error updating raffle:', error);
      throw error;
    }
  }
}

export const adminRaffleService = new AdminRaffleService(); 