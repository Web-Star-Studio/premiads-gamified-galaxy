
import React from "react";
import { Progress } from "@/components/ui/progress";
import { useRaffleData } from "./hooks/useRaffleData";
import { useRaffleParticipation } from "./hooks/useRaffleParticipation";
import RaffleHeader from "./components/RaffleHeader";
import RaffleInfoCard from "./components/RaffleInfoCard";
import RafflePrizesCard from "./components/RafflePrizesCard";
import ParticipationCard from "./components/ParticipationCard";
import PurchaseButton from "./components/PurchaseButton";

interface RaffleDetailsProps {
  raffleId: number;
}

const RaffleDetails = ({ raffleId }: RaffleDetailsProps) => {
  // Fetch raffle data
  const { raffle } = useRaffleData(raffleId);
  
  if (!raffle) {
    return (
      <div className="glass-panel p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-neon-cyan border-galaxy-purple rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">Carregando detalhes do sorteio...</p>
        </div>
      </div>
    );
  }
  
  // Participation hook
  const {
    userTickets,
    userPoints,
    participationCount,
    isParticipating,
    purchaseAmount,
    purchaseMode,
    pointsNeeded,
    canPurchaseWithTickets,
    canPurchaseWithPoints,
    handleDecreasePurchase,
    handleIncreasePurchase,
    handlePurchase,
    setPurchaseMode
  } = useRaffleParticipation(raffle.maxTicketsPerUser, raffle.ticketsRequired);

  return (
    <div className="glass-panel p-6">
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
        />
        
        <RafflePrizesCard prizes={raffle.prizes} />
      </div>
      
      {/* Participation Section */}
      <ParticipationCard 
        ticketsRequired={raffle.ticketsRequired}
        maxTicketsPerUser={raffle.maxTicketsPerUser}
        participationCount={participationCount}
        userTickets={userTickets}
        userPoints={userPoints}
        isParticipating={isParticipating}
        onPurchase={handlePurchase}
        purchaseMode={purchaseMode}
        setPurchaseMode={setPurchaseMode}
        purchaseAmount={purchaseAmount}
        handleDecreasePurchase={handleDecreasePurchase}
        handleIncreasePurchase={handleIncreasePurchase}
        canPurchaseWithTickets={canPurchaseWithTickets}
        canPurchaseWithPoints={canPurchaseWithPoints}
        pointsNeeded={pointsNeeded}
      />
      
      {/* Purchase Button */}
      <div className="flex justify-end">
        <PurchaseButton 
          isDisabled={(purchaseMode === 'tickets' && !canPurchaseWithTickets) || 
                      (purchaseMode === 'points' && !canPurchaseWithPoints) || 
                      isParticipating}
          isParticipating={isParticipating}
          purchaseMode={purchaseMode}
          purchaseAmount={purchaseAmount}
          pointsNeeded={pointsNeeded}
          onClick={handlePurchase}
        />
      </div>
    </div>
  );
};

export default RaffleDetails;
