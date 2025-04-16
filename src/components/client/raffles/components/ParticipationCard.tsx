
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Gift, Plus, Minus, Ticket, CreditCard } from "lucide-react";

interface ParticipationCardProps {
  ticketsRequired: number;
  maxTicketsPerUser: number;
  participationCount: number;
  userTickets: number;
  userPoints: number;
  isParticipating: boolean;
  onPurchase: () => void;
  purchaseMode: 'tickets' | 'points';
  setPurchaseMode: (mode: 'tickets' | 'points') => void;
  purchaseAmount: number;
  handleDecreasePurchase: () => void;
  handleIncreasePurchase: () => void;
  canPurchaseWithTickets: boolean;
  canPurchaseWithPoints: boolean;
  pointsNeeded: number;
}

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
  pointsNeeded
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
          {remainingSlots > 0 
            ? `Você pode adicionar até ${remainingSlots} participações neste sorteio.`
            : "Você atingiu o limite máximo de participações neste sorteio."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="flex items-center p-1 bg-galaxy-deepPurple/50 rounded-md border border-galaxy-purple/30">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-8 h-8 p-0"
                  onClick={handleDecreasePurchase}
                  disabled={purchaseAmount <= 1 || isParticipating}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{purchaseAmount}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-8 h-8 p-0"
                  onClick={handleIncreasePurchase}
                  disabled={purchaseAmount >= remainingSlots || isParticipating}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-gray-400">participações</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={purchaseMode === 'tickets' ? "secondary" : "outline"}
                size="sm"
                onClick={() => setPurchaseMode('tickets')}
                disabled={isParticipating}
                className={purchaseMode === 'tickets' ? "bg-neon-cyan/20 text-neon-cyan" : "bg-galaxy-deepPurple/30"}
              >
                <Ticket className="w-3 h-3 mr-1" />
                Tickets
              </Button>
              <Button
                variant={purchaseMode === 'points' ? "secondary" : "outline"}
                size="sm"
                onClick={() => setPurchaseMode('points')}
                disabled={isParticipating}
                className={purchaseMode === 'points' ? "bg-neon-pink/20 text-neon-pink" : "bg-galaxy-deepPurple/30"}
              >
                <CreditCard className="w-3 h-3 mr-1" />
                Pontos
              </Button>
            </div>
          </div>
          
          <div className="bg-galaxy-deepPurple/50 p-3 rounded-md border border-galaxy-purple/30">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm">Você tem:</div>
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <Ticket className="w-3 h-3 mr-1 text-neon-cyan" />
                  <span className="text-neon-cyan">{userTickets} tickets</span>
                </div>
                <div className="flex items-center">
                  <CreditCard className="w-3 h-3 mr-1 text-neon-pink" />
                  <span className="text-neon-pink">{userPoints} pontos</span>
                </div>
              </div>
            </div>
            
            {purchaseMode === 'tickets' ? (
              <div className="text-sm text-gray-400">
                Custo: <span className="text-neon-cyan">{purchaseAmount} tickets</span>
              </div>
            ) : (
              <div className="text-sm text-gray-400">
                Custo: <span className="text-neon-pink">{pointsNeeded} pontos</span> 
                <span className="text-xs ml-1">({purchaseAmount} x {ticketsRequired} tickets x 100 pontos)</span>
              </div>
            )}
          </div>
          
          {participationCount > 0 && (
            <div className="bg-galaxy-deepPurple/50 p-3 rounded-md border border-neon-cyan/20 text-sm">
              <div className="flex items-center">
                <AlertTriangle className="w-4 h-4 text-neon-cyan mr-2" />
                <span>Você já está participando com <span className="text-neon-cyan">{participationCount} ticket(s)</span></span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ParticipationCard;
