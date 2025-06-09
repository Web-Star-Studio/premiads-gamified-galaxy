import React from "react";
import { useRaffleData } from "./hooks/useRaffleData";
import { LoadingState, ErrorState } from "./components/detail-states";
import RaffleDetailsContent from "./components/detail-container/RaffleDetailsContent";
import { useToast } from "@/hooks/use-toast";

interface RaffleDetailsProps {
  raffleId: number;
}

const RaffleDetails = ({ raffleId }: RaffleDetailsProps) => {
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
  
  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }
  
  // Error state - no raffle found
  if (!raffle) {
    return <ErrorState />;
  }
  
  console.log("Rendering raffle details for raffle:", raffle.id, raffle.name);

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
