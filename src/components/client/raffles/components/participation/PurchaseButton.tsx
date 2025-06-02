
import React from 'react';
import { Button } from "@/components/ui/button";
import { Gift, Award, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ButtonLoadingSpinner from '@/components/ui/ButtonLoadingSpinner';
import { motion } from 'framer-motion';

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
}: PurchaseButtonProps) => (
    <div className="relative">
      {discountPercentage > 0 && purchaseMode === 'points' && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 400,
            damping: 10
          }}
        >
          <Badge 
            className="absolute -top-3 -right-2 bg-gradient-to-r from-neon-cyan to-neon-pink z-10 flex items-center gap-1 py-1 px-2 shadow-lg"
          >
            <Award className="w-3 h-3" />
            -{discountPercentage}%
          </Badge>
        </motion.div>
      )}
      
      <Button 
        variant={purchaseMode === 'tickets' ? "gradient" : "neon"}
        className="w-full py-3 relative overflow-hidden group"
        disabled={isDisabled || isParticipationClosed || isParticipating}
        onClick={onClick}
      >
        {isParticipating ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2"
          >
            <ButtonLoadingSpinner color="white" />
            <span>Processando...</span>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center"
          >
            {purchaseMode === 'tickets' ? (
              <>
                <Gift className="w-4 h-4 mr-2" />
                <span>Participar com {purchaseAmount} ticket{purchaseAmount > 1 ? 's' : ''}</span>
                <motion.div 
                  className="absolute -right-20 bottom-0 transform rotate-45"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 3,
                    repeatDelay: 1
                  }}
                >
                  <Sparkles className="w-5 h-5 text-white/70" />
                </motion.div>
              </>
            ) : (
              <>
                <Gift className="w-4 h-4 mr-2" />
                <span>Comprar com {pointsNeeded} tickets</span>
              </>
            )}
          </motion.div>
        )}
        
        {/* Hover effect overlay */}
        <motion.div 
          className="absolute inset-0 bg-white opacity-0 pointer-events-none"
          whileHover={{ opacity: 0.05 }}
          transition={{ duration: 0.3 }}
        />
      </Button>
    </div>
  );

export default PurchaseButton;
