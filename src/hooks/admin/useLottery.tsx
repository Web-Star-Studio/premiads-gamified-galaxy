import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSounds } from '@/hooks/use-sounds';
import { Lottery } from '@/components/admin/lottery/types';

export const useLottery = () => {
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { playSound } = useSounds();

  const fetchLotteries = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('raffles')
        .select(`
          *,
          winner:profiles!raffles_winner_user_id_fkey(
            id,
            full_name,
            avatar_url
          ),
          numbers:raffle_numbers(id)
        `);
        
      if (error) throw error;
      
      const transformedData: Lottery[] = (data || []).map(raffle => {
        const numbersSold = raffle.numbers?.length || 0;
        const progress = Math.round((numbersSold / raffle.numbers_total) * 100);
        
        let winner = raffle.winner ? {
          id: raffle.winner.id,
          name: raffle.winner.full_name || 'Unknown',
          avatar: raffle.winner.avatar_url || 'https://i.pravatar.cc/150?img=1'
        } : null;
        
        return {
          id: raffle.id,
          title: raffle.title,
          description: raffle.description,
          detailed_description: raffle.detailed_description,
          type: raffle.type,
          points: raffle.points,
          numbers_total: raffle.numbers_total,
          status: raffle.status as Lottery['status'], // Type assertion
          start_date: raffle.start_date,
          end_date: raffle.end_date,
          draw_date: raffle.draw_date,
          prize_type: raffle.prize_type,
          prize_value: raffle.prize_value,
          winner,
          created_at: raffle.created_at,
          updated_at: raffle.updated_at,
          numbers: raffle.numbers || [],
          progress,
          numbersSold
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
  const createLottery = async (lotteryData: Omit<Lottery, 'id' | 'progress' | 'numbersSold' | 'numbers'>) => {
    try {
      setLoading(true);
      playSound('pop');
      
      const { data, error } = await supabase
        .from('raffles')
        .insert({
          title: lotteryData.title,
          description: lotteryData.description,
          detailed_description: lotteryData.detailed_description,
          type: lotteryData.type,
          points: lotteryData.points,
          numbers_total: lotteryData.numbers_total,
          status: lotteryData.status,
          start_date: lotteryData.start_date,
          end_date: lotteryData.end_date,
          draw_date: lotteryData.draw_date,
          prize_type: lotteryData.prize_type,
          prize_value: lotteryData.prize_value
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Add the new lottery to state
      const newLottery: Lottery = {
        ...data,
        progress: 0,
        numbersSold: 0,
        numbers: []
      };
      
      setLotteries(prev => [newLottery, ...prev]);
      
      toast({
        title: 'Sorteio criado',
        description: `O sorteio "${lotteryData.title}" foi criado com sucesso.`
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
      
      // Get all participants for this raffle
      const { data: numbers, error: numbersError } = await supabase
        .from('raffle_numbers')
        .select('user_id')
        .eq('raffle_id', lotteryId);
        
      if (numbersError) throw numbersError;
      
      if (!numbers || numbers.length === 0) {
        throw new Error('Nenhum participante encontrado para este sorteio.');
      }
      
      // Select a random winner
      const winnerIndex = Math.floor(Math.random() * numbers.length);
      const winnerId = numbers[winnerIndex].user_id;
      
      // Update raffle with winner
      const { error: updateError } = await supabase
        .from('raffles')
        .update({ 
          status: 'completed',
          winner_user_id: winnerId,
          updated_at: new Date().toISOString()
        })
        .eq('id', lotteryId);
        
      if (updateError) throw updateError;
      
      // Get winner profile
      const { data: profile, error: profileError } = await supabase
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
              id: profile.id,
              name: profile.full_name || 'Unknown',
              avatar: profile.avatar_url || 'https://i.pravatar.cc/150?img=1'
            }
          };
        }
        return lottery;
      }));
      
      toast({
        title: 'Sorteio realizado',
        description: `Parabéns a ${profile.full_name || 'Usuário'} por ganhar o sorteio!`
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
