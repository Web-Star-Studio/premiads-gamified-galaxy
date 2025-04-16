
import React from 'react';
import { Button } from "@/components/ui/button";
import { Gift, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PurchaseButtonProps {
  isDisabled: boolean;
  isParticipating: boolean;
  isParticipationClosed?: boolean;
  purchaseMode: 'tickets' | 'points';
  purchaseAmount: number;
  pointsNeeded: number;
  onClick: () => void;
  discountPercentage?: number;
}

const PurchaseButton = ({
  isDisabled,
  isParticipating,
  isParticipationClosed = false,
  purchaseMode,
  purchaseAmount,
  pointsNeeded,
  onClick,
  discountPercentage = 0
}: PurchaseButtonProps) => {
  return (
    <div className="relative">
      {discountPercentage > 0 && purchaseMode === 'points' && (
        <Badge 
          className="absolute -top-3 -right-2 bg-gradient-to-r from-neon-cyan to-neon-pink z-10 flex items-center gap-1"
        >
          <Award className="w-3 h-3" />
          -{discountPercentage}%
        </Badge>
      )}
      
      <Button 
        className="neon-button w-full"
        disabled={isDisabled || isParticipationClosed}
        onClick={onClick}
      >
        {isParticipating ? (
          <>
            <div className="w-4 h-4 border-2 border-t-white/20 border-white rounded-full animate-spin mr-2"></div>
            Processando...
          </>
        ) : (
          <>
            <Gift className="w-4 h-4 mr-2" />
            {purchaseMode === 'tickets' 
              ? `Participar com ${purchaseAmount} ticket${purchaseAmount > 1 ? 's' : ''}` 
              : `Comprar com ${pointsNeeded} pontos`}
          </>
        )}
      </Button>
    </div>
  );
};

export default PurchaseButton;
