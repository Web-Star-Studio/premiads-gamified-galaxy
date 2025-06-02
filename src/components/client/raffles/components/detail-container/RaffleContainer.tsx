
import React from "react";
import { CountdownBadge } from "../../components/countdown";
import RaffleHeader from "../../components/RaffleHeader";
import RaffleInfoCard from "../../components/RaffleInfoCard";
import RafflePrizesCard from "../../components/RafflePrizesCard";
import ParticipationCard from "../../components/ParticipationCard";
import { Raffle } from "../../hooks/types/raffleTypes";
import { ParticipationResult } from "../../hooks/types/participationTypes";

interface RaffleContainerProps {
  raffle: Raffle;
  countdownInfo: {
    isCountingDown: boolean;
    timeRemaining: string;
    isLastHour: boolean;
    isParticipationClosed: boolean;
  };
  participation: ParticipationResult;
}

const RaffleContainer = ({ raffle, countdownInfo, participation }: RaffleContainerProps) => (
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

export default RaffleContainer;
