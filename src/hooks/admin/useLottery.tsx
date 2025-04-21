import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSounds } from '@/hooks/use-sounds';
import { format, parseISO } from 'date-fns';

export interface Lottery {
  id: string;
  name: string;
  title?: string;
  description: string;
  detailedDescription?: string;
  prizeType: string;
  prizeValue: number;
  imageUrl: string;
  startDate: string;
  endDate: string;
  drawDate: string | null;
  status: 'active' | 'pending' | 'completed' | 'canceled' | 'draft' | 'finished';
  winner?: {
    id: string;
    name: string;
    avatar: string;
  } | null;
  numbersTotal: number;
  pointsPerNumber: number;
  minPoints: number;
  numbersSold?: number;
  progress?: number;
  isAutoScheduled?: boolean;
  prizes?: any[];
}

export const useLottery = () => {
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { playSound } = useSounds();

  const fetchLotteries = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get raffles from database with a more flexible query
      const { data, error } = await supabase
        .from('raffles')
        .select(`
          *,
          winner_profile:winner_user_id (
            id,
            full_name,
            avatar_url
          )
        `);
        
      if (error) throw error;
      
      // Transform data to match our interface
      const transformedData: Lottery[] = data.map(raffle => {
        // Calculate progress
        const numbersSold = raffle.numbers_sold || 0;
        const progress = raffle.numbers_total > 0 
          ? Math.round((numbersSold / raffle.numbers_total) * 100) 
          : 0;
        
        // Get winner info if exists
        let winner = null;
        if (raffle.winner_profile) {
          winner = {
            id: raffle.winner_profile.id || '',
            name: raffle.winner_profile.full_name || 'Unknown',
            avatar: raffle.winner_profile.avatar_url || 'https://i.pravatar.cc/150?img=1'
          };
        }
        
        // Ensure status is one of the allowed enum values
        let status: Lottery['status'] = 'draft';
        const validStatuses: Lottery['status'][] = ['active', 'pending', 'completed', 'canceled', 'draft', 'finished'];
        if (validStatuses.includes(raffle.status)) {
          status = raffle.status;
        }
        
        return {
          id: raffle.id,
          name: raffle.title,
          description: raffle.description,
          detailedDescription: raffle.detailed_description,
          prizeType: raffle.prize_type,
          prizeValue: raffle.prize_value,
          imageUrl: raffle.image_url,
          startDate: raffle.start_date,
          endDate: raffle.end_date,
          drawDate: raffle.draw_date,
          status,
          winner,
          numbersTotal: raffle.numbers_total,
          pointsPerNumber: raffle.points_per_number,
          minPoints: raffle.min_points,
          numbersSold: numbersSold,
          progress,
          isAutoScheduled: true
        };
      });
      
      setLotteries(transformedData);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching lotteries:', err);
      setError(err.message);
      toast({
        title: 'Erro ao buscar sorteios',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Create a new lottery
  const createLottery = async (lotteryData: Omit<Lottery, 'id' | 'progress' | 'numbersSold'>) => {
    try {
      setLoading(true);
      playSound('pop');
      
      // Transform lottery data to match database schema
      const { data, error } = await supabase
        .from('raffles')
        .insert({
          title: lotteryData.name,
          description: lotteryData.description,
          detailed_description: lotteryData.detailedDescription || '',
          prize_type: lotteryData.prizeType,
          prize_value: lotteryData.prizeValue,
          image_url: lotteryData.imageUrl,
          start_date: lotteryData.startDate,
          end_date: lotteryData.endDate,
          draw_date: lotteryData.drawDate,
          status: lotteryData.status,
          numbers_total: lotteryData.numbersTotal,
          points_per_number: lotteryData.pointsPerNumber,
          min_points: lotteryData.minPoints
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Add the new lottery to state
      const newLottery: Lottery = {
        ...lotteryData,
        id: data.id,
        progress: 0,
        numbersSold: 0
      };
      
      setLotteries(prev => [newLottery, ...prev]);
      
      toast({
        title: 'Sorteio criado',
        description: `O sorteio "${lotteryData.name}" foi criado com sucesso.`
      });
      
      return newLottery;
    } catch (err: any) {
      console.error('Error creating lottery:', err);
      toast({
        title: 'Erro ao criar sorteio',
        description: err.message,
        variant: 'destructive'
      });
      playSound('error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a lottery
  const deleteLottery = async (lotteryId: string) => {
    try {
      setLoading(true);
      playSound('error');
      
      const { error } = await supabase
        .from('raffles')
        .delete()
        .eq('id', lotteryId);
        
      if (error) throw error;
      
      // Update state
      setLotteries(prev => prev.filter(lottery => lottery.id !== lotteryId));
      
      toast({
        title: 'Sorteio excluído',
        description: 'O sorteio foi removido com sucesso.'
      });
    } catch (err: any) {
      console.error('Error deleting lottery:', err);
      toast({
        title: 'Erro ao excluir sorteio',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Select a winner for a lottery
  const selectWinner = async (lotteryId: string) => {
    try {
      setLoading(true);
      playSound('reward');
      
      // Call the select_raffle_winner function
      const { data, error } = await supabase
        .rpc('select_raffle_winner', {
          raffle_id: lotteryId
        });
        
      if (error) throw error;
      
      // Get the winner details
      const winnerId = data;
      if (!winnerId) {
        throw new Error('Nenhum vencedor encontrado. Verifique se há participantes no sorteio.');
      }
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', winnerId)
        .single();
        
      if (profileError) throw profileError;
      
      // Update state
      setLotteries(prev => prev.map(lottery => {
        if (lottery.id === lotteryId) {
          return {
            ...lottery,
            status: 'completed',
            winner: {
              id: profileData.id,
              name: profileData.full_name || 'Usuário',
              avatar: profileData.avatar_url || 'https://i.pravatar.cc/150?img=1'
            }
          };
        }
        return lottery;
      }));
      
      toast({
        title: 'Sorteio realizado',
        description: `Parabéns a ${profileData.full_name || 'Usuário'} por ganhar o sorteio!`
      });
    } catch (err: any) {
      console.error('Error selecting winner:', err);
      toast({
        title: 'Erro ao selecionar vencedor',
        description: err.message,
        variant: 'destructive'
      });
      playSound('error');
    } finally {
      setLoading(false);
    }
  };

  // Load lotteries on component mount
  useEffect(() => {
    fetchLotteries();
  }, [fetchLotteries]);

  return {
    lotteries,
    loading,
    error,
    fetchLotteries,
    createLottery,
    deleteLottery,
    selectWinner
  };
};
