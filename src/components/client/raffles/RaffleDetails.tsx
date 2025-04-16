
import React from "react";
import { useRaffleData } from "./hooks/useRaffleData";
import { useRaffleParticipation } from "./hooks/useRaffleParticipation";
import { LoadingState, ErrorState } from "./components/detail-states";
import { RaffleContainer } from "./components/detail-container";
import { useToast } from "@/hooks/use-toast";

interface RaffleDetailsProps {
  raffleId: number;
}

const RaffleDetails = ({ raffleId }: RaffleDetailsProps) => {
  // Fetch raffle data
  const { raffle, isLoading, countdownInfo } = useRaffleData(raffleId);
  const { toast } = useToast();
  
  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }
  
  // Error state - no raffle found
  if (!raffle) {
    return <ErrorState />;
  }
  
  // Only initialize the participation hook if we have a raffle
  // This prevents the "rendered more hooks than previous render" error
  const participation = useRaffleParticipation({
    maxTicketsPerUser: raffle.maxTicketsPerUser, 
    ticketsRequired: raffle.ticketsRequired,
    isParticipationClosed: countdownInfo.isParticipationClosed
  });

  console.log("Rendering raffle details for raffle:", raffle.id, raffle.name);
  console.log("Participation state:", participation);

  return (
    <RaffleContainer 
      raffle={raffle}
      countdownInfo={countdownInfo}
      participation={participation}
    />
  );
};

export default RaffleDetails;
