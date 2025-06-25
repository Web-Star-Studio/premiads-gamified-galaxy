import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import raffleService from '@/services/raffles';
import { Lottery, LotteryParticipation } from '@/types/lottery';
import { useToast } from '@/hooks/use-toast';
import { useSounds } from '@/hooks/use-sounds';
import { differenceInSeconds, parseISO, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface CountdownInfo {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  timeRemaining: number;
  isExpired: boolean;
  formattedDate: string;
}

// Interface para os tokens do usuário
interface UserTokens {
  rifas: number;
  points: number;
}

export function useRaffleData(raffleId: number | string) {
  const [raffle, setRaffle] = useState<Lottery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [participation, setParticipation] = useState<LotteryParticipation | null>(null);
  const [userNumbers, setUserNumbers] = useState<number[]>([]);
  const [countdownInfo, setCountdownInfo] = useState<CountdownInfo | null>(null);
  const [availableTickets, setAvailableTickets] = useState(0);
  const [participationLoading, setParticipationLoading] = useState(false);
  
  // Using mock data until we have proper user token management
  const [userTokens, setUserTokens] = useState<UserTokens>({ rifas: 10, points: 100 });
  const { userName } = useUser(); // Just using userName from context
  const { user } = useAuth(); // Get authenticated user from auth context
  const userId = user?.id; // Use real user ID from authentication
  const { toast } = useToast();
  const { playSound } = useSounds();
  
  // Use ref to prevent unnecessary renders
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const endDateRef = useRef<string | null>(null);

  // Memoize updateCountdown to prevent recreating on each render
  const updateCountdown = useCallback((endDateStr: string) => {
    if (!endDateStr) return;
    
    const endDate = parseISO(endDateStr);
    const now = new Date();
    const diff = differenceInSeconds(endDate, now);
    
    const days = Math.floor(diff / (60 * 60 * 24));
    const hours = Math.floor((diff % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((diff % (60 * 60)) / 60);
    const seconds = diff % 60;
    
    setCountdownInfo({
      days,
      hours, 
      minutes,
      seconds,
      timeRemaining: diff,
      isExpired: diff <= 0,
      formattedDate: format(endDate, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })
    });
  }, []);

  // Fetch raffle data
  useEffect(() => {
    async function fetchRaffleData() {
      setIsLoading(true);
      try {
        const data = await raffleService.getRaffleById(String(raffleId));
        if (data) {
          setRaffle(data);
          
          // Calculate countdown
          if (data.end_date) {
            // Store end date in ref to use in interval
            endDateRef.current = data.end_date;
            updateCountdown(data.end_date);
            
            // Clear any existing interval
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            
            // Set up new interval
            intervalRef.current = setInterval(() => {
              if (endDateRef.current) {
                updateCountdown(endDateRef.current);
              }
            }, 1000);
          }
        }
      } catch (error) {
        console.error("Error fetching raffle:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do sorteio.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    if (raffleId) {
      fetchRaffleData();
    }
    
    // Cleanup interval on unmount or raffleId change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [raffleId, toast, updateCountdown]);

  // Fetch user participation and rifas
  useEffect(() => {
    async function fetchUserParticipation() {
      if (!userId || !raffleId) return;
      
      try {
        // Usar consulta direta para evitar erro de relacionamento
        const { data: participationData, error: participationError } = await supabase
          .from('lottery_participants' as any)
          .select('*')
          .eq('user_id', userId)
          .eq('lottery_id', String(raffleId))
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (participationError) {
          console.warn('Error fetching participation:', participationError);
        } else if (participationData) {
          const userParticipation = {
            id: participationData.id,
            user_id: participationData.user_id,
            lottery_id: participationData.lottery_id,
            numbers: participationData.numbers || [],
            created_at: participationData.created_at,
            updated_at: participationData.updated_at
          };
          
          setParticipation(userParticipation);
          setUserNumbers(userParticipation.numbers);
        } else {
          setParticipation(null);
          setUserNumbers([]);
        }
        
        // Fetch user's rifas from profile
        const userProfile = await raffleService.getUserProfile(userId);
        if (userProfile) {
          setUserTokens({
            rifas: userProfile.rifas || 0,
            points: userProfile.points || 0
          });
          setAvailableTickets(userProfile.rifas || 0);
        }
      } catch (error) {
        console.error("Error fetching user participation:", error);
      }
    }
    
    if (userId && raffleId) {
      fetchUserParticipation();
    }
  }, [userId, raffleId]);

  async function participateInRaffle(numberOfTickets: number) {
    if (!userId || !raffleId || !raffle) {
      toast({
        title: "Erro",
        description: "Não foi possível participar do sorteio. Verifique se você está logado.",
        variant: "destructive"
      });
      return;
    }
    
    if (numberOfTickets <= 0) {
      toast({
        title: "Erro",
        description: "Você precisa escolher pelo menos 1 rifa.",
        variant: "destructive"
      });
      return;
    }
    
    if (availableTickets < numberOfTickets) {
      toast({
        title: "Rifas insuficientes",
        description: "Você não tem rifas suficientes para participar.",
        variant: "destructive"
      });
      playSound("error");
      return;
    }
    
    // Verificar se o número total de participações não ultrapassa o limite do sorteio
    if (raffle.numbers_total && userNumbers.length + numberOfTickets > raffle.numbers_total) {
      toast({
        title: "Limite excedido",
        description: `Este sorteio permite no máximo ${raffle.numbers_total} números por participante.`,
        variant: "destructive"
      });
      playSound("error");
      return;
    }
    
    setParticipationLoading(true);
    
    try {
      // Participate in raffle
      const result = await raffleService.participateInRaffle(
        userId,
        String(raffleId),
        numberOfTickets
      );
      
      // Update user data
      setParticipation(result);
      setUserNumbers(result.numbers);
      
      // Update user tokens
      setUserTokens(prev => ({
        ...prev,
        rifas: prev.rifas - numberOfTickets
      }));
      
      setAvailableTickets(prev => prev - numberOfTickets);
      
      toast({
        title: "Participação confirmada!",
        description: `Você recebeu ${numberOfTickets} números para o sorteio.`,
      });
      
      playSound("reward");
    } catch (error) {
      console.error("Error participating in raffle:", error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível participar do sorteio.",
        variant: "destructive"
      });
      playSound("error");
    } finally {
      setParticipationLoading(false);
    }
  }

  return {
    raffle,
    isLoading,
    countdownInfo,
    participation,
    userNumbers,
    availableTickets,
    participationLoading,
    participateInRaffle
  };
}
