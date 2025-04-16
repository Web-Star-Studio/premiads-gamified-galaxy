
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface CountdownBadgeProps {
  timeRemaining: string;
  isLastHour: boolean;
  isParticipationClosed: boolean;
}

const CountdownBadge = ({ 
  timeRemaining, 
  isLastHour,
  isParticipationClosed 
}: CountdownBadgeProps) => {
  if (isParticipationClosed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <Badge 
          className="bg-red-500 text-white px-3 py-1 text-sm font-medium flex items-center gap-1"
        >
          <AlertCircle className="w-3 h-3" />
          Participação encerrada - Sorteio {timeRemaining}
        </Badge>
      </motion.div>
    );
  }
  
  if (isLastHour) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        className="mb-4"
      >
        <Badge 
          className="bg-amber-500 text-black px-3 py-1 text-sm font-medium flex items-center gap-1"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          ⚠️ Última hora para participar! Sorteio {timeRemaining}
        </Badge>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <Badge 
        className="bg-blue-500 text-white px-3 py-1 text-sm font-medium flex items-center gap-1"
      >
        <Clock className="w-3 h-3" />
        ⏳ Sorteio {timeRemaining}
      </Badge>
    </motion.div>
  );
};

export default CountdownBadge;
