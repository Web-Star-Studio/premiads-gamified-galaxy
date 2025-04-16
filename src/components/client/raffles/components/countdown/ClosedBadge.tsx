
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ClosedBadgeProps {
  timeRemaining: string;
}

const ClosedBadge = ({ timeRemaining }: ClosedBadgeProps) => {
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
};

export default ClosedBadge;
