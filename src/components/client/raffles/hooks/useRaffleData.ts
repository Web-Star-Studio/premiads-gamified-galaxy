import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import raffleService from '@/services/raffles';
import { Lottery, LotteryParticipation } from '@/types/lottery';
import { useToast } from '@/hooks/use-toast';
import { useSounds } from '@/hooks/use-sounds';
import { differenceInSeconds, parseISO, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface CountdownInfo {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  timeRemaining: number;
  isExpired: boolean;
  formattedDate: string;
}

// Mock user tokens for now - in a real implementation, this would come from a UserTokens context
interface UserTokens {
  rifas: number;
  points: number;
}

export function useRaffleData(raffleId: number | string) {
  const [raffle, setRaffle] = useState<Lottery | null>(null);
  const [participation, setParticipation] = useState<LotteryParticipation | null>(null);
  const [countdownInfo, setCountdownInfo] = useState<CountdownInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [participationLoading, setParticipationLoading] = useState(false);
  const [userNumbers, setUserNumbers] = useState<number[]>([]);
  const [availableTickets, setAvailableTickets] = useState(0);
  // Using mock data until we have proper user token management
  const [userTokens, setUserTokens] = useState<UserTokens>({ rifas: 10, points: 100 });
  const { userName } = useUser(); // Just using userName from context
  const userId = "mock-user-id"; // Mock user ID
  const { toast } = useToast();
  const { playSound } = useSounds();

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
            updateCountdown(data.end_date);
            const intervalId = setInterval(() => {
              updateCountdown(data.end_date);
            }, 1000);
            
            return () => clearInterval(intervalId);
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
  }, [raffleId, toast]);

  // Fetch user participation
  useEffect(() => {
    async function fetchUserParticipation() {
      if (!userId || !raffleId) return;
      
      try {
        // Fetch user participations
        const participations = await raffleService.getUserParticipations(userId);
        const userParticipation = participations.find(p => p.participation.lottery_id === String(raffleId));
        
        if (userParticipation) {
          setParticipation(userParticipation.participation);
          setUserNumbers(userParticipation.participation.numbers);
        } else {
          setParticipation(null);
          setUserNumbers([]);
        }
        
        // For now, just set a fixed number of available tickets
        setAvailableTickets(userTokens.rifas);
      } catch (error) {
        console.error("Error fetching user participation:", error);
      }
    }
    
    if (userId && raffleId) {
      fetchUserParticipation();
    }
  }, [userId, raffleId, userTokens.rifas]);

  function updateCountdown(endDateStr: string) {
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
  }

  async function participateInRaffle(numberOfTickets: number) {
    if (!userId || !raffleId || !raffle) {
      toast({
        title: "Erro",
        description: "Não foi possível participar do sorteio.",
        variant: "destructive"
      });
      return;
    }
    
    if (numberOfTickets <= 0) {
      toast({
        title: "Erro",
        description: "Você precisa escolher pelo menos 1 ticket.",
        variant: "destructive"
      });
      return;
    }
    
    if (availableTickets < numberOfTickets) {
      toast({
        title: "Tickets insuficientes",
        description: "Você não tem tickets suficientes para participar.",
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
      setUserTokens({
        ...userTokens,
        rifas: userTokens.rifas - numberOfTickets
      });
      
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
        description: "Não foi possível participar do sorteio.",
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
