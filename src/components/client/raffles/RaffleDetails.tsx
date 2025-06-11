import React, { useRef, useEffect } from "react";
import { useRaffleData } from "./hooks/useRaffleData";
import { LoadingState, ErrorState } from "./components/detail-states";
import RaffleDetailsContent from "./components/detail-container/RaffleDetailsContent";
import { useToast } from "@/hooks/use-toast";

interface RaffleDetailsProps {
  raffleId: number;
}

const RaffleDetails = ({ raffleId }: RaffleDetailsProps) => {
  // Ref to track if we've already logged this raffle
  const hasLoggedRef = useRef(false);
  
  // Fetch raffle data with our enhanced hook
  const { 
    raffle, 
    isLoading, 
    countdownInfo,
    userNumbers,
    availableTickets,
    participationLoading,
    participateInRaffle 
  } = useRaffleData(raffleId);
  const { toast } = useToast();
  
  // Log only once when raffle loads
  useEffect(() => {
    if (raffle && !hasLoggedRef.current) {
      console.log("Rendering raffle details for raffle:", raffle.id, raffle.name);
      hasLoggedRef.current = true;
    }
  }, [raffle]);
  
  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }
  
  // Error state - no raffle found
  if (!raffle) {
    return <ErrorState />;
  }
  
  // Render the raffle details with our enhanced components
  return (
    <RaffleDetailsContent 
      raffle={raffle}
      countdownInfo={countdownInfo}
      userNumbers={userNumbers}
      availableTickets={availableTickets}
      participationLoading={participationLoading}
      participateInRaffle={participateInRaffle}
    />
  );
};

export default RaffleDetails;
