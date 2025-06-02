
import React from 'react';
import { Ticket, CreditCard, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UserBalanceDisplayProps {
  userTickets: number;
  userPoints: number;
  purchaseMode: 'tickets' | 'points';
  purchaseAmount: number;
  pointsNeeded: number;
  ticketsRequired: number;
  discountPercentage?: number;
  currentLevelName?: string;
}

const UserBalanceDisplay = ({
  userTickets,
  userPoints,
  purchaseMode,
  purchaseAmount,
  pointsNeeded,
  ticketsRequired,
  discountPercentage = 0,
  currentLevelName = 'Bronze'
}: UserBalanceDisplayProps) => (
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
            <span className="text-neon-pink">{userPoints} tickets</span>
          </div>
        </div>
      </div>
      
      {purchaseMode === 'tickets' ? (
        <div className="text-sm text-gray-400">
          Custo: <span className="text-neon-cyan">{purchaseAmount} tickets</span>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <div className="text-sm text-gray-400 flex items-center justify-between">
            <div>
              Custo: <span className="text-neon-pink">{pointsNeeded} tickets</span> 
              <span className="text-xs ml-1">({purchaseAmount} x {ticketsRequired} tickets x 100 tickets)</span>
            </div>
            
            {discountPercentage > 0 && (
              <Badge className="bg-gradient-to-r from-neon-cyan to-neon-pink text-white">
                -{discountPercentage}%
              </Badge>
            )}
          </div>
          
          {discountPercentage > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Award className="w-3 h-3 text-neon-cyan" />
              <span>Benefício nível {currentLevelName}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

export default UserBalanceDisplay;
