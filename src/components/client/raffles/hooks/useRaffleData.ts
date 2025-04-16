
import { useState, useEffect } from 'react';
import { useSounds } from "@/hooks/use-sounds";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock data for raffles - would be replaced with API call in real app
const RAFFLES = [
  {
    id: 1,
    name: "Sorteio Semanal de Pontos",
    description: "Participe do sorteio semanal e concorra a pontos extras e benefícios exclusivos. Quanto mais tickets, maiores suas chances!",
    startDate: "2025-04-15",
    endDate: "2025-04-22",
    drawDate: "2025-04-23",
    ticketsRequired: 1,
    status: "active",
    maxTicketsPerUser: 10,
    totalParticipants: 147,
    totalTickets: 500,
    soldTickets: 238,
    progress: 47,
    minPointsReachedAt: null,
    isAutoScheduled: true,
    minPoints: 10000,
    imageUrl: "https://source.unsplash.com/random/800x400/?prize",
    prizes: [
      { id: 1, name: "5000 Pontos", rarity: "common", probability: 60, image: "https://source.unsplash.com/random/100x100/?coin" },
      { id: 2, name: "10000 Pontos", rarity: "uncommon", probability: 30, image: "https://source.unsplash.com/random/100x100/?diamond" },
      { id: 3, name: "Premium por 1 mês", rarity: "rare", probability: 10, image: "https://source.unsplash.com/random/100x100/?crown" }
    ]
  },
  {
    id: 2,
    name: "Loot Box Especial",
    description: "Uma loot box recheada de itens exclusivos e raros para personalizar sua experiência. Participe agora!",
    startDate: "2025-04-17",
    endDate: "2025-04-24",
    drawDate: "2025-04-25",
    ticketsRequired: 3,
    status: "active",
    maxTicketsPerUser: 5,
    totalParticipants: 72,
    totalTickets: 200,
    soldTickets: 86,
    progress: 43,
    minPointsReachedAt: "2025-04-19T14:30:00Z",
    isAutoScheduled: true,
    minPoints: 5000,
    imageUrl: "https://source.unsplash.com/random/800x400/?lootbox",
    prizes: [
      { id: 4, name: "Skin Exclusiva", rarity: "common", probability: 55, image: "https://source.unsplash.com/random/100x100/?skin" },
      { id: 5, name: "Título Raro", rarity: "uncommon", probability: 35, image: "https://source.unsplash.com/random/100x100/?title" },
      { id: 6, name: "Pacote VIP", rarity: "legendary", probability: 10, image: "https://source.unsplash.com/random/100x100/?vip" }
    ]
  },
  {
    id: 3,
    name: "Sorteio de Eletrônicos",
    description: "Concorra a incríveis produtos eletrônicos! Este é um sorteio especial com prêmios físicos que serão enviados diretamente para sua casa.",
    startDate: "2025-04-10",
    endDate: "2025-05-10",
    drawDate: "2025-05-12",
    ticketsRequired: 5,
    status: "active",
    maxTicketsPerUser: 3,
    totalParticipants: 238,
    totalTickets: 1000,
    soldTickets: 680,
    progress: 68,
    minPointsReachedAt: "2025-04-15T10:00:00Z",
    isAutoScheduled: true,
    minPoints: 30000,
    imageUrl: "https://source.unsplash.com/random/800x400/?electronics",
    prizes: [
      { id: 7, name: "Fone de Ouvido", rarity: "uncommon", probability: 70, image: "https://source.unsplash.com/random/100x100/?headphones" },
      { id: 8, name: "SmartWatch", rarity: "rare", probability: 25, image: "https://source.unsplash.com/random/100x100/?smartwatch" },
      { id: 9, name: "Smartphone", rarity: "legendary", probability: 5, image: "https://source.unsplash.com/random/100x100/?smartphone" }
    ]
  }
];

export const useRaffleData = (raffleId: number | null) => {
  const { playSound } = useSounds();
  const [raffle, setRaffle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [countdownInfo, setCountdownInfo] = useState<{
    isCountingDown: boolean;
    timeRemaining: string;
    isLastHour: boolean;
    isParticipationClosed: boolean;
  }>({
    isCountingDown: false,
    timeRemaining: '',
    isLastHour: false,
    isParticipationClosed: false
  });
  
  // Function to calculate countdown information
  const calculateCountdownInfo = (minPointsReachedAt: string | null, drawDate: string | null) => {
    if (!minPointsReachedAt || !drawDate) {
      return {
        isCountingDown: false,
        timeRemaining: '',
        isLastHour: false,
        isParticipationClosed: false
      };
    }
    
    const now = new Date();
    const drawDateTime = new Date(drawDate);
    const minPointsReachedAtTime = new Date(minPointsReachedAt);
    
    // Check if we're in countdown mode (within 48 hours after min points reached)
    const isCountingDown = minPointsReachedAtTime <= now && now <= drawDateTime;
    
    // Calculate time remaining until draw
    const timeRemaining = formatDistanceToNow(drawDateTime, { addSuffix: true, locale: ptBR });
    
    // Check if we're in the last hour
    const oneHourBeforeDraw = new Date(drawDateTime);
    oneHourBeforeDraw.setHours(oneHourBeforeDraw.getHours() - 1);
    const isLastHour = now >= oneHourBeforeDraw && now <= drawDateTime;
    
    // Check if participation is closed (less than 1 hour before draw)
    const isParticipationClosed = now >= oneHourBeforeDraw;
    
    return {
      isCountingDown,
      timeRemaining,
      isLastHour,
      isParticipationClosed
    };
  };
  
  useEffect(() => {
    const fetchRaffle = async () => {
      setIsLoading(true);
      
      if (!raffleId) {
        setRaffle(null);
        setIsLoading(false);
        return;
      }
      
      try {
        // In a real app, this would be an API fetch 
        // const { data, error } = await supabase
        //   .from('raffles')
        //   .select('*')
        //   .eq('id', raffleId)
        //   .single();
        
        // For now, use mock data
        const foundRaffle = RAFFLES.find(r => r.id === raffleId);
        
        if (foundRaffle) {
          // Calculate countdown information
          const countdownInfo = calculateCountdownInfo(
            foundRaffle.minPointsReachedAt, 
            foundRaffle.drawDate
          );
          
          setRaffle(foundRaffle);
          setCountdownInfo(countdownInfo);
        }
      } catch (error) {
        console.error("Error fetching raffle:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRaffle();
    
    // Set up interval to update countdown information every minute
    const intervalId = setInterval(() => {
      if (raffle?.minPointsReachedAt) {
        const updatedCountdownInfo = calculateCountdownInfo(
          raffle.minPointsReachedAt,
          raffle.drawDate
        );
        setCountdownInfo(updatedCountdownInfo);
      }
    }, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, [raffleId, raffle?.minPointsReachedAt, raffle?.drawDate]);
  
  return { 
    raffle, 
    isLoading,
    countdownInfo
  };
};
