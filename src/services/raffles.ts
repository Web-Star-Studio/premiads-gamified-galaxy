import { supabase } from '@/integrations/supabase/client';
import { Lottery, LotteryFormValues, LotteryParticipation } from '@/types/lottery';
import { withPerformanceMonitoring } from '@/utils/performance-monitor';

// Generate UUID function for IDs using crypto API or fallback
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Helper function to transform database data to UI format
const transformLotteryFromDatabase = (dbData: any): Lottery => {
  // Helper to safely handle dates
  const safeDate = (dateValue: any) => {
    if (!dateValue) return '';
    try {
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? '' : dateValue;
    } catch {
      return '';
    }
  };

  return {
    ...dbData,
    // Map snake_case to camelCase for UI compatibility
    detailedDescription: dbData.detailed_description || dbData.detailedDescription || '',
    prizeType: dbData.prize_type || dbData.prizeType || '',
    prizeValue: Number(dbData.prize_value || dbData.prizeValue || 0),
    imageUrl: dbData.image_url || dbData.imageUrl || '',
    startDate: safeDate(dbData.start_date || dbData.startDate),
    endDate: safeDate(dbData.end_date || dbData.endDate),
    drawDate: safeDate(dbData.draw_date || dbData.drawDate),
    numbersTotal: dbData.numbers_total || dbData.numbersTotal || 0,
    numbersSold: dbData.numbers_sold || dbData.numbersSold || 0,
    // Keep both versions for compatibility
    detailed_description: dbData.detailed_description || '',
    prize_type: dbData.prize_type || '',
    prize_value: Number(dbData.prize_value || 0),
    image_url: dbData.image_url || '',
    start_date: safeDate(dbData.start_date || dbData.startDate),
    end_date: safeDate(dbData.end_date || dbData.endDate),
    draw_date: safeDate(dbData.draw_date || dbData.drawDate),
    numbers_total: dbData.numbers_total || 0,
    numbers_sold: dbData.numbers_sold || 0,
    // Set defaults for required fields
    title: dbData.title || dbData.name || '',
    tickets_reward: dbData.tickets_reward || 0,
    type: dbData.type || 'lottery',
    pointsPerNumber: dbData.points_per_number || dbData.pointsPerNumber || 1,
    minPoints: dbData.min_points || dbData.minPoints || 0,
    numbers: dbData.numbers || [],
    progress: dbData.progress || 0,
    prizes: dbData.prizes || [],
    created_at: dbData.created_at || '',
    updated_at: dbData.updated_at || ''
  };
};

// Helper function to transform form data to Supabase structure
const transformLotteryData = (formData: LotteryFormValues) => {
  // Calculate end date as 72 hours after start date if auto-scheduled
  const endDate = formData.isAutoScheduled 
    ? new Date(formData.startDate.getTime() + (72 * 60 * 60 * 1000)) 
    : formData.endDate;
    
  return {
    id: null, // Will be set in createRaffle function
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
      
      // Ensure we have a valid UUID
      if (!raffleData.id || raffleData.id === 'null') {
        raffleData.id = generateUUID();
      }
      
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
      
      // Remove ID from data and let Supabase generate it
      const raffleDataForInsert = {
        ...raffleData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Remove the id field to let the database auto-generate
      delete raffleDataForInsert.id;
      
      // Insert raffle into database
      const { data, error } = await supabase
        .from('lotteries')
        .insert(raffleDataForInsert)
        .select()
        .single();
        
      if (error) {
        console.error('Insert error:', error);
        throw error;
      }
      
      // Check if we got valid data with ID
      if (!data) {
        throw new Error('Failed to create raffle: No data returned');
      }
      
             // Log the received data to debug
       console.log('Raffle created successfully:', { id: data.id, name: data.name });
       
       // Transform database data to UI format
       return transformLotteryFromDatabase(data);
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
          
        updates.imageUrl = publicUrlData.publicUrl;
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
      
      if (updates.imageUrl) updateData.image_url = updates.imageUrl;
      
      if (updates.startDate) updateData.start_date = updates.startDate;
      
      if (updates.endDate) updateData.end_date = updates.endDate;
      
      if (updates.status) updateData.status = updates.status;
      
      if (updates.numbersTotal !== undefined) updateData.numbers_total = updates.numbersTotal;
      
      if (updates.pointsPerNumber !== undefined) updateData.points_per_number = updates.pointsPerNumber;
      
      if (updates.minPoints !== undefined) updateData.min_points = updates.minPoints;
      
      if (updates.numberRange) {
        updateData.number_range = {
          min: updates.numberRange.min,
          max: updates.numberRange.max
        };
      }
      
      if (updates.isAutoScheduled !== undefined) updateData.is_auto_scheduled = updates.isAutoScheduled;
      
      // Update raffle in database
      const { data, error } = await supabase
        .from('lotteries')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      // Transform database data to UI format
      return transformLotteryFromDatabase(data);
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
      
      const { data, error } = await query
        .not('id', 'is', null)  // Filter out records with null ID
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Database error fetching raffles:', error);
        throw error;
      }
      
      // Additional filter to ensure we only return records with valid IDs and proper dates
      const validData = (data || []).filter(item => 
        item.id != null && 
        item.id !== 'null' &&
        item.id !== 'undefined' &&
        item.start_date != null && 
        item.end_date != null
      );
      
      console.log(`Fetched ${validData.length} valid lotteries from database`);
      // Transform database data to UI format
      return validData.map(item => transformLotteryFromDatabase(item));
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
      
      // Transform database data to UI format
      return data ? transformLotteryFromDatabase(data) : null;
    } catch (error) {
      console.error('Error fetching raffle:', error);
      return null;
    }
  }, 'getRaffleById'),
  
  deleteRaffle: withPerformanceMonitoring(async (id: string): Promise<boolean> => {
    try {
      // Validate ID first
      if (!id || id === 'null' || id === 'undefined') {
        console.error('Invalid ID provided for deletion:', id);
        return false;
      }
      
      // First check if the raffle exists
      const { data: existing, error: checkError } = await supabase
        .from('lotteries')
        .select('id')
        .eq('id', id)
        .single();
        
      if (checkError || !existing) {
        console.error('Raffle not found for deletion:', id);
        return false;
      }
      
      // Delete related records first (lottery_participants, lottery_winners)
      await supabase
        .from('lottery_participants')
        .delete()
        .eq('lottery_id', id);
        
      await supabase
        .from('lottery_winners')
        .delete()
        .eq('lottery_id', id);
      
      // Now delete the raffle
      const { error } = await supabase
        .from('lotteries')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Error deleting raffle:', error);
        return false;
      }
      
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
      
      // Transform database data to UI format
      return data ? transformLotteryFromDatabase(data) : null;
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
      
      // Transform database data to UI format
      return (data || []).map(item => transformLotteryFromDatabase(item));
    } catch (error) {
      console.error('Error fetching active raffles:', error);
      return [];
    }
  }, 'getActiveRaffles'),
  
  participateInRaffle: withPerformanceMonitoring(async (userId: string, raffleId: string, numberOfTickets: number): Promise<LotteryParticipation> => {
    try {
      // Use the optimized SQL function to avoid recursion
      const { data: result, error } = await supabase.rpc('participate_in_raffle', {
        p_user_id: userId,
        p_lottery_id: raffleId,
        p_number_of_tickets: numberOfTickets
      });

      if (error) {
        console.error('RPC Error:', error);
        throw new Error(error.message);
      }

      if (!result?.success) {
        throw new Error(result?.error || 'Failed to participate in raffle');
      }

      // Fetch the updated participation to return
      const { data: participation, error: fetchError } = await supabase
        .from('lottery_participants')
        .select('*')
        .eq('id', result.participation_id)
        .single();

      if (fetchError) {
        console.error('Fetch Error:', fetchError);
        throw new Error('Error fetching participation: ' + fetchError.message);
      }

      return participation as LotteryParticipation;
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
      const { data, error } = await supabase.rpc('get_user_won_raffles', {
        p_user_id: userId
      });

      if (error) {
        console.error('Error calling get_user_won_raffles RPC:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching user won raffles:', error);
      return [];
    }
  }, 'getUserWonRaffles')
};

export default raffleService; 
                                        