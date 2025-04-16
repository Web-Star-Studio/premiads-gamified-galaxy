
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";

const POINTS_PER_TICKET = 100;

export const useRaffleParticipation = (maxTicketsPerUser: number, ticketsRequired: number) => {
  const { toast } = useToast();
  const { playSound } = useSounds();
  const [userTickets, setUserTickets] = useState(8); // Mock data - would come from API
  const [userPoints, setUserPoints] = useState(750); // Mock data - would come from API
  const [participationCount, setParticipationCount] = useState(0);
  const [isParticipating, setIsParticipating] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState(1);
  const [purchaseMode, setPurchaseMode] = useState<'tickets' | 'points'>('tickets');
  
  const remainingSlots = maxTicketsPerUser - participationCount;
  const pointsNeeded = purchaseAmount * ticketsRequired * POINTS_PER_TICKET;
  
  const canPurchaseWithTickets = () => {
    return (
      userTickets >= purchaseAmount && 
      participationCount + purchaseAmount <= maxTicketsPerUser
    );
  };
  
  const canPurchaseWithPoints = () => {
    return (
      userPoints >= pointsNeeded && 
      participationCount + purchaseAmount <= maxTicketsPerUser
    );
  };
  
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
  
  const handlePurchase = () => {
    if (purchaseMode === 'tickets' && !canPurchaseWithTickets()) {
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
    
    if (purchaseMode === 'points' && !canPurchaseWithPoints()) {
      toast({
        title: "Não foi possível participar",
        description: "Você não tem pontos suficientes",
        variant: "destructive",
      });
      playSound("error");
      return;
    }
    
    setIsParticipating(true);
    
    // Simulate participation process
    setTimeout(() => {
      if (purchaseMode === 'tickets') {
        setUserTickets(prev => prev - purchaseAmount);
      } else {
        setUserPoints(prev => prev - pointsNeeded);
      }
      
      setParticipationCount(prev => prev + purchaseAmount);
      setIsParticipating(false);
      
      // Show success message
      toast({
        title: "Participação confirmada!",
        description: `Você está participando com ${participationCount + purchaseAmount} ticket(s)!`,
      });
      
      playSound("reward");
    }, 1500);
  };
  
  return {
    userTickets,
    userPoints,
    participationCount,
    isParticipating,
    purchaseAmount,
    purchaseMode,
    pointsNeeded,
    canPurchaseWithTickets: canPurchaseWithTickets(),
    canPurchaseWithPoints: canPurchaseWithPoints(),
    handleDecreasePurchase,
    handleIncreasePurchase,
    handlePurchase,
    setPurchaseMode,
    remainingSlots
  };
};
