
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { useUserLevel } from "@/hooks/useUserLevel";
import { 
  calculatePointsNeeded, 
  canPurchaseWithTickets, 
  canPurchaseWithPoints,
  getDiscountPercentage,
  POINTS_PER_TICKET
} from './utils/participationUtils';
import { fetchUserData, participateInRaffle } from './services/participationService';
import { ParticipationConfig, ParticipationResult } from './types/participationTypes';

export const useRaffleParticipation = ({
  maxTicketsPerUser, 
  ticketsRequired,
  isParticipationClosed = false
}: ParticipationConfig): ParticipationResult => {
  const { toast } = useToast();
  const { playSound } = useSounds();
  const [userTickets, setUserTickets] = useState(8); // Default value before data loads
  const [userRifas, setUserRifas] = useState(750); // Default value before data loads
  const [participationCount, setParticipationCount] = useState(0);
  const [isParticipating, setIsParticipating] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState(1);
  const [purchaseMode, setPurchaseMode] = useState<'tickets' | 'points'>('tickets');
  const { levelInfo } = useUserLevel(userRifas);
  
  const remainingSlots = maxTicketsPerUser - participationCount;
  
  // Get level discount percentage
  const discountPercentage = getDiscountPercentage(levelInfo);
  
  // Calculate points needed with level discount
  const pointsNeeded = calculatePointsNeeded(
    purchaseAmount,
    ticketsRequired,
    discountPercentage
  );
  
  // Determine if purchases are possible
  const canBuyWithTickets = canPurchaseWithTickets(
    userTickets,
    purchaseAmount,
    participationCount,
    maxTicketsPerUser,
    isParticipationClosed
  );
  
  const canBuyWithPoints = canPurchaseWithPoints(
    userRifas,
    pointsNeeded,
    participationCount,
    purchaseAmount,
    maxTicketsPerUser,
    isParticipationClosed
  );
  
  // Fetch user data
  useEffect(() => {
    const loadUserData = async () => {
      const userData = await fetchUserData();
      setUserRifas(userData.rifas);
      setUserTickets(userData.tickets);
    };
    
    loadUserData();
  }, []);
  
  const handleDecreasePurchase = () => {
    if (purchaseAmount > 1) {
      setPurchaseAmount(purchaseAmount - 1);
    }
  };
  
  const handleIncreasePurchase = () => {
    if (purchaseAmount < remainingSlots) {
      setPurchaseAmount(purchaseAmount + 1);
    }
  };
  
  const handlePurchase = async () => {
    if (isParticipationClosed) {
      toast({
        title: "Participação encerrada",
        description: "Este sorteio não está mais aceitando novas participações pois falta menos de 1 hora para o sorteio.",
        variant: "destructive",
      });
      playSound("error");
      return;
    }
    
    if (purchaseMode === 'tickets' && !canBuyWithTickets) {
      toast({
        title: "Não foi possível participar",
        description: userTickets < purchaseAmount
          ? "Você não tem tickets suficientes" 
          : "Você atingiu o limite máximo de participações",
        variant: "destructive",
      });
      playSound("error");
      return;
    }
    
    if (purchaseMode === 'points' && !canBuyWithPoints) {
      toast({
        title: "Não foi possível participar",
        description: "Você não tem pontos suficientes",
        variant: "destructive",
      });
      playSound("error");
      return;
    }
    
    setIsParticipating(true);
    
    try {
      // Simulate participation process
      const result = await participateInRaffle(
        1, // Raffle ID would come from props in a real scenario
        purchaseAmount,
        purchaseMode,
        pointsNeeded
      );
      
      if (result.success) {
        if (purchaseMode === 'tickets') {
          setUserTickets(prev => prev - purchaseAmount);
        } else {
          setUserRifas(prev => prev - pointsNeeded);
        }
        
        setParticipationCount(prev => prev + purchaseAmount);
        
        // Show success message
        toast({
          title: "Participação confirmada!",
          description: `Você está participando com ${participationCount + purchaseAmount} ticket(s)!`,
        });
        
        playSound("reward");
      }
    } catch (error) {
      toast({
        title: "Erro ao participar",
        description: "Ocorreu um erro ao processar sua participação. Tente novamente.",
        variant: "destructive",
      });
      playSound("error");
    } finally {
      setIsParticipating(false);
    }
  };
  
  return {
    // State
    userTickets,
    userPoints: userRifas, // Alias for compatibility
    participationCount,
    isParticipating,
    purchaseAmount,
    purchaseMode,
    remainingSlots,
    
    // Calculations
    pointsNeeded,
    canPurchaseWithTickets: canBuyWithTickets,
    canPurchaseWithPoints: canBuyWithPoints,
    discountPercentage,
    currentLevelName: levelInfo?.currentLevel.name || 'Bronze',
    
    // Handlers
    handleDecreasePurchase,
    handleIncreasePurchase,
    handlePurchase,
    setPurchaseMode,
    
    // Config
    isParticipationClosed
  };
};
