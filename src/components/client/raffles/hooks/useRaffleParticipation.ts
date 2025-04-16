
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { useUserLevel } from "@/hooks/useUserLevel";
import { supabase } from "@/integrations/supabase/client";

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
  const { levelInfo } = useUserLevel(userPoints);
  
  const remainingSlots = maxTicketsPerUser - participationCount;
  
  // Calculate points needed with level discount (if available)
  const calculatePointsNeeded = () => {
    if (!levelInfo) return purchaseAmount * ticketsRequired * POINTS_PER_TICKET;
    
    const discount = levelInfo.currentLevel.benefits.ticket_discount / 100;
    const basePointsNeeded = purchaseAmount * ticketsRequired * POINTS_PER_TICKET;
    return Math.round(basePointsNeeded * (1 - discount));
  };
  
  const pointsNeeded = calculatePointsNeeded();
  
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('points')
          .eq('id', session.user.id)
          .single();
          
        if (profileData) {
          setUserPoints(profileData.points);
        }
        
        // Here we would also fetch tickets information
      }
    };
    
    fetchUserData();
  }, []);
  
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
  
  // Get discount percentage from user level
  const getDiscountPercentage = () => {
    if (!levelInfo) return 0;
    return levelInfo.currentLevel.benefits.ticket_discount;
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
    remainingSlots,
    discountPercentage: getDiscountPercentage(),
    currentLevelName: levelInfo?.currentLevel.name || 'Bronze'
  };
};
