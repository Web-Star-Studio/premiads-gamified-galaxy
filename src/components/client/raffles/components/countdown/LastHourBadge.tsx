
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface LastHourBadgeProps {
  timeRemaining: string;
}

const LastHourBadge = ({ timeRemaining }: LastHourBadgeProps) => {
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
};

export default LastHourBadge;
