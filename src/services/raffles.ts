import { supabase } from '@/integrations/supabase/client';
import { Lottery, LotteryFormValues, LotteryParticipation } from '@/types/lottery';
import { withPerformanceMonitoring } from '@/utils/performance-monitor';

// Helper function to transform form data to Supabase structure
const transformLotteryData = (formData: LotteryFormValues): Omit<Lottery, 'id'> => {
  // Calculate end date as 72 hours after start date if auto-scheduled
  const endDate = formData.isAutoScheduled 
    ? new Date(formData.startDate.getTime() + (72 * 60 * 60 * 1000)) 
    : formData.endDate;
    
  return {
    name: formData.name,
    title: formData.name,
    description: formData.description,
    detailed_description: formData.detailedDescription,
    detailedDescription: formData.detailedDescription,
    prize_type: formData.prizeType,
    prizeType: formData.prizeType,
    prize_value: formData.prizeValue,
    prizeValue: formData.prizeValue,
    imageUrl: formData.imageUrl || '',
    image_url: formData.imageUrl || '',
    start_date: formData.startDate.toISOString(),
    startDate: formData.startDate.toISOString(),
    end_date: endDate.toISOString(),
    endDate: endDate.toISOString(),
    draw_date: endDate.toISOString(),
    drawDate: endDate.toISOString(),
    status: formData.status,
    numbers_total: formData.numbersTotal,
    numbersTotal: formData.numbersTotal,
    tickets_reward: formData.pointsPerNumber,
    type: 'regular',
    pointsPerNumber: formData.pointsPerNumber,
    minPoints: formData.minPoints,
    progress: 0,
    numbersSold: 0,
    numbers: [],
    prizes: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    number_range: {
      min: formData.numberRange.min,
      max: formData.numberRange.max
    },
    isAutoScheduled: formData.isAutoScheduled,
    winner: null
  };
};

export const raffleService = {
  // Admin operations
  createRaffle: withPerformanceMonitoring(async (formData: LotteryFormValues, imageFile?: File): Promise<Lottery> => {
    try {
      // Transform form data to Supabase structure
      const raffleData = transformLotteryData(formData);
      
      // Handle image upload if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const filePath = `raffle-images/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('lottery-images')
          .upload(filePath, imageFile);
          
        if (uploadError) throw uploadError;
        
        // Get public URL for the uploaded image
        const { data: publicUrlData } = supabase.storage
          .from('lottery-images')
          .getPublicUrl(filePath);
          
        raffleData.imageUrl = publicUrlData.publicUrl;
        raffleData.image_url = publicUrlData.publicUrl;
      }
      
      // Insert raffle into database
      const { data, error } = await supabase
        .from('lotteries')
        .insert(raffleData)
        .select()
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error creating raffle:', error);
      throw error;
    }
  }, 'createRaffle'),
  
  updateRaffle: withPerformanceMonitoring(async (id: string, updates: Partial<LotteryFormValues>, imageFile?: File): Promise<Lottery> => {
    try {
      // Start with existing raffle data
      const { data: existingRaffle, error: fetchError } = await supabase
        .from('lotteries')
        .select('*')
        .eq('id', id)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Handle image upload if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const filePath = `raffle-images/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('lottery-images')
          .upload(filePath, imageFile);
          
        if (uploadError) throw uploadError;
        
        // Get public URL for the uploaded image
        const { data: publicUrlData } = supabase.storage
          .from('lottery-images')
          .getPublicUrl(filePath);
          
        updates.imageUrl = publicUrlData.publicUrl;
      }
      
      // Prepare update data
      const updateData: any = {
        updated_at: new Date().toISOString()
      };
      
      // Map form values to database fields
      if (updates.name) {
        updateData.name = updates.name;
        updateData.title = updates.name;
      }
      
      if (updates.description) updateData.description = updates.description;
      if (updates.detailedDescription) {
        updateData.detailed_description = updates.detailedDescription;
        updateData.detailedDescription = updates.detailedDescription;
      }
      
      if (updates.prizeType) {
        updateData.prize_type = updates.prizeType;
        updateData.prizeType = updates.prizeType;
      }
      
      if (updates.prizeValue !== undefined) {
        updateData.prize_value = updates.prizeValue;
        updateData.prizeValue = updates.prizeValue;
      }
      
      if (updates.imageUrl) {
        updateData.imageUrl = updates.imageUrl;
        updateData.image_url = updates.imageUrl;
      }
      
      if (updates.startDate) {
        updateData.start_date = updates.startDate.toISOString();
        updateData.startDate = updates.startDate.toISOString();
      }
      
      if (updates.endDate) {
        updateData.end_date = updates.endDate.toISOString();
        updateData.endDate = updates.endDate.toISOString();
      }
      
      if (updates.status) updateData.status = updates.status;
      
      if (updates.numbersTotal !== undefined) {
        updateData.numbers_total = updates.numbersTotal;
        updateData.numbersTotal = updates.numbersTotal;
      }
      
      if (updates.pointsPerNumber !== undefined) {
        updateData.tickets_reward = updates.pointsPerNumber;
        updateData.pointsPerNumber = updates.pointsPerNumber;
      }
      
      if (updates.minPoints !== undefined) updateData.minPoints = updates.minPoints;
      
      if (updates.numberRange) {
        updateData.number_range = {
          min: updates.numberRange.min,
          max: updates.numberRange.max
        };
      }
      
      if (updates.isAutoScheduled !== undefined) updateData.isAutoScheduled = updates.isAutoScheduled;
      
      // Update raffle in database
      const { data, error } = await supabase
        .from('lotteries')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error updating raffle:', error);
      throw error;
    }
  }, 'updateRaffle'),
  
  getRaffles: withPerformanceMonitoring(async (status?: string): Promise<Lottery[]> => {
    try {
      let query = supabase.from('lotteries').select('*');
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching raffles:', error);
      return [];
    }
  }, 'getRaffles'),
  
  getRaffleById: withPerformanceMonitoring(async (id: string): Promise<Lottery | null> => {
    try {
      const { data, error } = await supabase
        .from('lotteries')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching raffle:', error);
      return null;
    }
  }, 'getRaffleById'),
  
  deleteRaffle: withPerformanceMonitoring(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('lotteries')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting raffle:', error);
      return false;
    }
  }, 'deleteRaffle'),
  
  updateRaffleStatus: withPerformanceMonitoring(async (id: string, status: Lottery['status']): Promise<Lottery | null> => {
    try {
      const { data, error } = await supabase
        .from('lotteries')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error updating raffle status:', error);
      return null;
    }
  }, 'updateRaffleStatus'),
  
  generateRandomNumber: withPerformanceMonitoring(async (min: number, max: number): Promise<number> => {
    // Generate a random number between min and max (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }, 'generateRandomNumber'),
  
  drawRaffle: withPerformanceMonitoring(async (id: string): Promise<{ winning_number: number; winner_id?: string }> => {
    try {
      // Get raffle details
      const { data: raffle, error: raffleError } = await supabase
        .from('lotteries')
        .select('*')
        .eq('id', id)
        .single();
        
      if (raffleError) throw raffleError;
      
      // Generate winning number
      const min = raffle.number_range?.min || 1;
      const max = raffle.number_range?.max || raffle.numbersTotal;
      const winningNumber = await raffleService.generateRandomNumber(min, max);
      
      // Find participant with the winning number
      const { data: participants, error: participantsError } = await supabase
        .from('lottery_participants')
        .select('*')
        .eq('lottery_id', id);
        
      if (participantsError) throw participantsError;
      
      // Find the winner by checking which participant has the winning number
      let winnerId = null;
      for (const participant of participants || []) {
        if (participant.numbers.includes(winningNumber)) {
          winnerId = participant.user_id;
          break;
        }
      }
      
      // Update raffle with winner info
      const { error: updateError } = await supabase
        .from('lotteries')
        .update({
          status: 'completed',
          winning_number: winningNumber,
          winner: winnerId ? { id: winnerId } : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (updateError) throw updateError;
      
      // If winner found, create winner record
      if (winnerId) {
        const { error: winnerError } = await supabase
          .from('lottery_winners')
          .insert({
            lottery_id: id,
            user_id: winnerId,
            winning_number: winningNumber,
            prize_name: raffle.name,
            prize_value: raffle.prizeValue
          });
          
        if (winnerError) throw winnerError;
      }
      
      return {
        winning_number: winningNumber,
        winner_id: winnerId || undefined
      };
    } catch (error) {
      console.error('Error drawing raffle:', error);
      throw error;
    }
  }, 'drawRaffle'),
  
  // Participant operations
  getActiveRaffles: withPerformanceMonitoring(async (): Promise<Lottery[]> => {
    try {
      const { data, error } = await supabase
        .from('lotteries')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching active raffles:', error);
      return [];
    }
  }, 'getActiveRaffles'),
  
  participateInRaffle: withPerformanceMonitoring(async (userId: string, raffleId: string, numberOfTickets: number): Promise<LotteryParticipation> => {
    try {
      // Get raffle details
      const { data: raffle, error: raffleError } = await supabase
        .from('lotteries')
        .select('*')
        .eq('id', raffleId)
        .single();
        
      if (raffleError) throw raffleError;
      
      // Check if raffle is active
      if (raffle.status !== 'active') {
        throw new Error('Este sorteio não está ativo');
      }
      
      // Check if user has enough tickets
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('rifas')
        .eq('id', userId)
        .single();
        
      if (profileError) throw profileError;
      
      if (!profile || profile.rifas < numberOfTickets) {
        throw new Error('Você não tem tickets suficientes para participar');
      }
      
      // Generate unique numbers for the user
      const min = raffle.number_range?.min || 1;
      const max = raffle.number_range?.max || raffle.numbersTotal;
      
      // Check existing numbers already assigned to other participants
      const { data: existingParticipations, error: participationsError } = await supabase
        .from('lottery_participants')
        .select('numbers')
        .eq('lottery_id', raffleId);
        
      if (participationsError) throw participationsError;
      
      // Flatten all existing numbers
      const assignedNumbers = existingParticipations?.flatMap(p => p.numbers) || [];
      
      // Generate unique numbers for this user
      const userNumbers: number[] = [];
      while (userNumbers.length < numberOfTickets) {
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        
        // Only add if not already assigned
        if (!assignedNumbers.includes(randomNumber) && !userNumbers.includes(randomNumber)) {
          userNumbers.push(randomNumber);
        }
      }
      
      // Check if user already has a participation
      const { data: existingParticipation, error: existingError } = await supabase
        .from('lottery_participants')
        .select('*')
        .eq('lottery_id', raffleId)
        .eq('user_id', userId)
        .single();
        
      let participation;
      
      if (!existingError && existingParticipation) {
        // Update existing participation
        const updatedNumbers = [...existingParticipation.numbers, ...userNumbers];
        
        const { data, error } = await supabase
          .from('lottery_participants')
          .update({
            numbers: updatedNumbers,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingParticipation.id)
          .select()
          .single();
          
        if (error) throw error;
        
        participation = data;
      } else {
        // Create new participation
        const { data, error } = await supabase
          .from('lottery_participants')
          .insert({
            user_id: userId,
            lottery_id: raffleId,
            numbers: userNumbers,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
          
        if (error) throw error;
        
        participation = data;
      }
      
      // Update raffle progress
      const totalParticipants = (await supabase
        .from('lottery_participants')
        .select('numbers')
        .eq('lottery_id', raffleId)).data || [];
      
      const totalNumbersSold = totalParticipants.reduce((sum, p) => sum + p.numbers.length, 0);
      const progress = Math.min(100, Math.round((totalNumbersSold / raffle.numbersTotal) * 100));
      
      await supabase
        .from('lotteries')
        .update({
          progress,
          numbersSold: totalNumbersSold,
          updated_at: new Date().toISOString()
        })
        .eq('id', raffleId);
        
      // Deduct tickets from user
      await supabase
        .from('profiles')
        .update({
          rifas: profile.rifas - numberOfTickets
        })
        .eq('id', userId);
        
      return participation;
    } catch (error) {
      console.error('Error participating in raffle:', error);
      throw error;
    }
  }, 'participateInRaffle'),
  
  getUserParticipations: withPerformanceMonitoring(async (userId: string): Promise<{ participation: LotteryParticipation; raffle: Lottery }[]> => {
    try {
      const { data, error } = await supabase
        .from('lottery_participants')
        .select(`
          *,
          lottery:lotteries(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data?.map(item => ({
        participation: {
          id: item.id,
          user_id: item.user_id,
          lottery_id: item.lottery_id,
          numbers: item.numbers,
          created_at: item.created_at,
          updated_at: item.updated_at
        },
        raffle: item.lottery
      })) || [];
    } catch (error) {
      console.error('Error fetching user participations:', error);
      return [];
    }
  }, 'getUserParticipations')
};

export default raffleService; 