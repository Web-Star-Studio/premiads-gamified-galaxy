
import React from "react";
import { useRaffleParticipation } from "../../hooks/useRaffleParticipation";
import { RaffleContainer } from "./index";
import { Raffle } from "../../hooks/types/raffleTypes";

interface RaffleDetailsContentProps {
  raffle: Raffle;
  countdownInfo: {
    isCountingDown: boolean;
    timeRemaining: string;
    isLastHour: boolean;
    isParticipationClosed: boolean;
  };
}

// Este componente separado garantirá que os hooks sejam chamados de forma consistente
const RaffleDetailsContent = ({ raffle, countdownInfo }: RaffleDetailsContentProps) => {
  // Aqui podemos usar o hook de participação com segurança
  const participation = useRaffleParticipation({
    maxTicketsPerUser: raffle.maxTicketsPerUser, 
    ticketsRequired: raffle.ticketsRequired,
    isParticipationClosed: countdownInfo.isParticipationClosed
  });

  return (
    <RaffleContainer 
      raffle={raffle}
      countdownInfo={countdownInfo}
      participation={participation}
    />
  );
};

export default RaffleDetailsContent;
