
import React from 'react';
import { Button } from "@/components/ui/button";
import { Gift, Lock } from "lucide-react";

interface PurchaseButtonProps {
  isDisabled: boolean;
  isParticipating: boolean;
  isParticipationClosed: boolean;
  purchaseMode: 'tickets' | 'points';
  purchaseAmount: number;
  pointsNeeded: number;
  onClick: () => void;
}

const PurchaseButton = ({
  isDisabled,
  isParticipating,
  isParticipationClosed,
  purchaseMode,
  purchaseAmount,
  pointsNeeded,
  onClick
}: PurchaseButtonProps) => {
  return (
    <Button 
      className="neon-button w-full"
      disabled={isDisabled || isParticipating || isParticipationClosed}
      onClick={onClick}
    >
      {isParticipating ? (
        <>
          <div className="w-4 h-4 border-2 border-t-white/20 border-white rounded-full animate-spin mr-2"></div>
          Processando...
        </>
      ) : isParticipationClosed ? (
        <>
          <Lock className="w-4 h-4 mr-2" />
          Participação encerrada
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
  );
};

export default PurchaseButton;
