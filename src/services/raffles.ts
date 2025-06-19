import { supabase } from '@/integrations/supabase/client';
import { Lottery, LotteryFormValues, LotteryParticipation } from '@/types/lottery';
import { withPerformanceMonitoring } from '@/utils/performance-monitor';

// Generate UUID function for IDs
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Helper function to transform form data to Supabase structure
const transformLotteryData = (formData: LotteryFormValues) => {
  // Calculate end date as 72 hours after start date if auto-scheduled
  const endDate = formData.isAutoScheduled 
    ? new Date(formData.startDate.getTime() + (72 * 60 * 60 * 1000)) 
    : formData.endDate;
    
  return {
    id: generateUUID(), // Explicitly generate UUID for id
    name: formData.name,
    title: formData.name,
    description: formData.description,
    detailed_description: formData.detailedDescription,
    prize_type: formData.prizeType,
    prize_value: formData.prizeValue,
    image_url: formData.imageUrl || '',
    start_date: formData.startDate.toISOString(),
    end_date: endDate.toISOString(),
    draw_date: endDate.toISOString(),
    status: formData.status,
    numbers_total: formData.numbersTotal,
    points_per_number: formData.pointsPerNumber,
    min_points: formData.minPoints,
    number_range: {
      min: formData.numberRange.min,
      max: formData.numberRange.max
    },
    is_auto_scheduled: formData.isAutoScheduled,
    progress: 0,
    numbers_sold: 0,
    winner: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
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
        const filePath = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('raffle-images')
          .upload(filePath, imageFile);
          
        if (uploadError) throw uploadError;
        
        // Get public URL for the uploaded image
        const { data: publicUrlData } = supabase.storage
          .from('raffle-images')
          .getPublicUrl(filePath);
          
        raffleData.image_url = publicUrlData.publicUrl;
      }
      
      // Insert raffle into database with explicitly generated ID
      const { data, error } = await (supabase as any)
        .from('lotteries')
        .insert(raffleData)
        .select()
        .single();
        
      if (error) throw error;
      
      return data as unknown as Lottery;
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
        const filePath = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('raffle-images')
          .upload(filePath, imageFile);
          
        if (uploadError) throw uploadError;
        
        // Get public URL for the uploaded image
        const { data: publicUrlData } = supabase.storage
          .from('raffle-images')
          .getPublicUrl(filePath);
          
        updates.image_url = publicUrlData.publicUrl;
      }
      
      // Prepare update data
      const updateData: any = {
        updated_at: new Date().toISOString()
      };
      
      // Map form values to database fields using snake_case only
      if (updates.name) {
        updateData.name = updates.name;
        updateData.title = updates.name;
      }
      
      if (updates.description) updateData.description = updates.description;
      if (updates.detailedDescription) updateData.detailed_description = updates.detailedDescription;
      
      if (updates.prizeType) updateData.prize_type = updates.prizeType;
      
      if (updates.prizeValue !== undefined) updateData.prize_value = updates.prizeValue;
      
      if (updates.image_url) updateData.image_url = updates.image_url;
      
      if (updates.start_date) updateData.start_date = updates.start_date;
      
      if (updates.end_date) updateData.end_date = updates.end_date;
      
      if (updates.status) updateData.status = updates.status;
      
      if (updates.numbers_total !== undefined) updateData.numbers_total = updates.numbers_total;
      
      if (updates.points_per_number !== undefined) updateData.points_per_number = updates.points_per_number;
      
      if (updates.min_points !== undefined) updateData.min_points = updates.min_points;
      
      if (updates.number_range) {
        updateData.number_range = {
          min: updates.number_range.min,
          max: updates.number_range.max
        };
      }
      
      if (updates.is_auto_scheduled !== undefined) updateData.is_auto_scheduled = updates.is_auto_scheduled;
      
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
      const max = raffle.number_range?.max || raffle.numbers_total;
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
            prize_value: raffle.prize_value
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
      
      // Check if user has enough rifas
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('rifas')
        .eq('id', userId)
        .single();
        
      if (profileError) throw profileError;
      
      if (!profile || profile.rifas < numberOfTickets) {
        throw new Error('Você não tem rifas suficientes para participar');
      }
      
      // Generate unique numbers for the user
      const min = 1;
      const max = raffle.numbers_total;
      
      // Check existing numbers already assigned to any participants in this raffle
      const { data: existingParticipations, error: participationsError } = await supabase
        .from('lottery_participants')
        .select('numbers')
        .eq('lottery_id', raffleId);
        
      if (participationsError) throw participationsError;
      
      // Flatten all existing numbers
      const assignedNumbers = existingParticipations?.flatMap(p => p.numbers) || [];
      
      // Get all available numbers (those not yet assigned)
      let availableNumbers: number[] = [];
      for (let i = min; i <= max; i++) {
        if (!assignedNumbers.includes(i)) {
          availableNumbers.push(i);
        }
      }
      
      // Check if there are enough available numbers
      if (availableNumbers.length < numberOfTickets) {
        throw new Error(`Apenas ${availableNumbers.length} números disponíveis neste sorteio`);
      }
      
      // Shuffle available numbers to get random ones
      availableNumbers = availableNumbers.sort(() => Math.random() - 0.5);
      
      // Select required number of tickets
      const userNumbers = availableNumbers.slice(0, numberOfTickets);
      
      // Check if user already has a participation in this raffle
      const { data: existingParticipation, error: existingError } = await supabase
        .from('lottery_participants')
        .select('*')
        .eq('lottery_id', raffleId)
        .eq('user_id', userId)
        .maybeSingle();
       
      let participation;
      
      // Begin transaction using RPC
      let rpcFailed = false;
      try {
        const { data: transaction, error: transactionError } = await supabase.rpc('participate_in_raffle', {
          p_user_id: userId,
          p_lottery_id: raffleId,
          p_numbers: userNumbers,
          p_tickets_used: numberOfTickets
        });
        if (transactionError) rpcFailed = true;
        if (transaction) participation = transaction as any;
      } catch (rpcError) {
        rpcFailed = true;
        console.warn('RPC participate_in_raffle falhou, caindo para lógica manual:', rpcError);
      }
      
      // Caso RPC falhe, use fallback manual
      if (rpcFailed || !participation) {
        // Start a manual transaction
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
        const progress = Math.min(100, Math.round((totalNumbersSold / raffle.numbers_total) * 100));
        
        await supabase
          .from('lotteries')
          .update({
            progress,
            numbers_sold: totalNumbersSold,
            updated_at: new Date().toISOString()
          })
          .eq('id', raffleId);
          
        // Deduct rifas from user
        await supabase
          .from('profiles')
          .update({
            rifas: profile.rifas - numberOfTickets
          })
          .eq('id', userId);
      }
      
      // Get updated participation data
      const { data: updatedParticipation, error: updatedError } = await supabase
        .from('lottery_participants')
        .select('*')
        .eq('lottery_id', raffleId)
        .eq('user_id', userId)
        .maybeSingle();
        
      if (updatedError) throw updatedError;
      if (!updatedParticipation) throw new Error('Participação não encontrada após atualização.');
      
      return updatedParticipation;
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
  }, 'getUserParticipations'),
  
  // Buscar perfil do usuário com suas rifas
  getUserProfile: withPerformanceMonitoring(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('rifas, cashback_balance')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      return {
        rifas: data?.rifas || 0,
        points: data?.cashback_balance || 0
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { rifas: 0, points: 0 };
    }
  }, 'getUserProfile'),
  
  getUserWonRaffles: withPerformanceMonitoring(async (userId: string) => {
    try {
      // Buscar os sorteios ganhos pelo usuário com detalhes do sorteio
      const { data, error } = await supabase
        .from('lottery_winners')
        .select(`
          *,
          raffle:lotteries(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching user won raffles:', error);
      return [];
    }
  }, 'getUserWonRaffles')
};

export default raffleService; 
