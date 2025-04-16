
import React from "react";
import { Progress } from "@/components/ui/progress";
import { useRaffleData } from "./hooks/useRaffleData";
import { useRaffleParticipation } from "./hooks/useRaffleParticipation";
import RaffleHeader from "./components/RaffleHeader";
import RaffleInfoCard from "./components/RaffleInfoCard";
import RafflePrizesCard from "./components/RafflePrizesCard";
import ParticipationCard from "./components/ParticipationCard";
import { CountdownBadge } from "./components/countdown";
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
    return (
      <div className="glass-panel p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-neon-cyan border-galaxy-purple rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">Carregando detalhes do sorteio...</p>
        </div>
      </div>
    );
  }
  
  // Error state - no raffle found
  if (!raffle) {
    return (
      <div className="glass-panel p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 text-red-500 mx-auto flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <p className="mt-4 text-gray-400">Sorteio não encontrado ou indisponível.</p>
        </div>
      </div>
    );
  }
  
  // Participation hook with config object
  const participation = useRaffleParticipation({
    maxTicketsPerUser: raffle.maxTicketsPerUser, 
    ticketsRequired: raffle.ticketsRequired,
    isParticipationClosed: countdownInfo.isParticipationClosed
  });

  return (
    <div className="glass-panel p-6">
      {/* Countdown Badge for Raffles in Countdown */}
      {countdownInfo.isCountingDown && (
        <CountdownBadge 
          timeRemaining={countdownInfo.timeRemaining}
          isLastHour={countdownInfo.isLastHour}
          isParticipationClosed={countdownInfo.isParticipationClosed}
        />
      )}
      
      {/* Raffle Header with Image, Title and Progress */}
      <RaffleHeader 
        name={raffle.name}
        imageUrl={raffle.imageUrl}
        description={raffle.description}
        ticketsRequired={raffle.ticketsRequired}
        progress={raffle.progress}
        soldTickets={raffle.soldTickets}
        totalTickets={raffle.totalTickets}
      />
      
      {/* Info Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <RaffleInfoCard 
          startDate={raffle.startDate}
          endDate={raffle.endDate}
          drawDate={raffle.drawDate}
          totalParticipants={raffle.totalParticipants}
          ticketsRequired={raffle.ticketsRequired}
          maxTicketsPerUser={raffle.maxTicketsPerUser}
          minPoints={raffle.minPoints}
          isAutoScheduled={raffle.isAutoScheduled}
          minPointsReachedAt={raffle.minPointsReachedAt}
        />
        
        <RafflePrizesCard prizes={raffle.prizes} />
      </div>
      
      {/* Participation Section */}
      <ParticipationCard 
        ticketsRequired={raffle.ticketsRequired}
        maxTicketsPerUser={raffle.maxTicketsPerUser}
        participationCount={participation.participationCount}
        userTickets={participation.userTickets}
        userPoints={participation.userPoints}
        isParticipating={participation.isParticipating}
        onPurchase={participation.handlePurchase}
        purchaseMode={participation.purchaseMode}
        setPurchaseMode={participation.setPurchaseMode}
        purchaseAmount={participation.purchaseAmount}
        handleDecreasePurchase={participation.handleDecreasePurchase}
        handleIncreasePurchase={participation.handleIncreasePurchase}
        canPurchaseWithTickets={participation.canPurchaseWithTickets}
        canPurchaseWithPoints={participation.canPurchaseWithPoints}
        pointsNeeded={participation.pointsNeeded}
        discountPercentage={participation.discountPercentage}
        currentLevelName={participation.currentLevelName}
        isParticipationClosed={participation.isParticipationClosed}
      />
    </div>
  );
};

export default RaffleDetails;
