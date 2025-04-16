
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Ticket, Lock } from "lucide-react";
import AmountSelector from './AmountSelector';
import ModeSelector from './ModeSelector';
import UserBalanceDisplay from './UserBalanceDisplay';
import { ClosedMessage, ParticipationMessage } from './StatusMessage';
import PurchaseButton from './PurchaseButton';
import { ParticipationCardProps } from './types';

const ParticipationCard = ({
  ticketsRequired,
  maxTicketsPerUser,
  participationCount,
  userTickets,
  userPoints,
  isParticipating,
  onPurchase,
  purchaseMode,
  setPurchaseMode,
  purchaseAmount,
  handleDecreasePurchase,
  handleIncreasePurchase,
  canPurchaseWithTickets,
  canPurchaseWithPoints,
  pointsNeeded,
  discountPercentage = 0,
  currentLevelName = 'Bronze',
  isParticipationClosed = false
}: ParticipationCardProps) => {
  const remainingSlots = maxTicketsPerUser - participationCount;

  return (
    <Card className="bg-galaxy-deepPurple/30 border-galaxy-purple/20 mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Ticket className="w-4 h-4 text-neon-cyan" />
          Participar do Sorteio
        </CardTitle>
        <CardDescription>
          {isParticipationClosed ? (
            <div className="flex items-center text-amber-400">
              <Lock className="w-3.5 h-3.5 mr-1" />
              Participação encerrada: o sorteio ocorrerá em menos de 1 hora
            </div>
          ) : remainingSlots > 0 ? (
            `Você pode adicionar até ${remainingSlots} participações neste sorteio.`
          ) : (
            "Você atingiu o limite máximo de participações neste sorteio."
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <AmountSelector
              purchaseAmount={purchaseAmount}
              onDecrease={handleDecreasePurchase}
              onIncrease={handleIncreasePurchase}
              disabled={isParticipating || isParticipationClosed}
              min={1}
              max={remainingSlots}
            />
            
            <ModeSelector
              purchaseMode={purchaseMode}
              setPurchaseMode={setPurchaseMode}
              disabled={isParticipating || isParticipationClosed}
            />
          </div>
          
          <UserBalanceDisplay
            userTickets={userTickets}
            userPoints={userPoints}
            purchaseMode={purchaseMode}
            purchaseAmount={purchaseAmount}
            pointsNeeded={pointsNeeded}
            ticketsRequired={ticketsRequired}
            discountPercentage={discountPercentage}
            currentLevelName={currentLevelName}
          />
          
          <ClosedMessage isVisible={isParticipationClosed} />
          
          <ParticipationMessage isVisible={participationCount > 0} count={participationCount} />
          
          <PurchaseButton
            isDisabled={
              (purchaseMode === 'tickets' && !canPurchaseWithTickets) || 
              (purchaseMode === 'points' && !canPurchaseWithPoints)
            }
            isParticipating={isParticipating}
            isParticipationClosed={isParticipationClosed}
            purchaseMode={purchaseMode}
            purchaseAmount={purchaseAmount}
            pointsNeeded={pointsNeeded}
            onClick={onPurchase}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ParticipationCard;
