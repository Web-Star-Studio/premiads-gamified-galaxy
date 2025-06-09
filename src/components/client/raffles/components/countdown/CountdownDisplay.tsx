import React from 'react';
import { motion } from 'framer-motion';
import { CountdownInfo } from '../../hooks/useRaffleData';

interface CountdownDisplayProps {
  countdownInfo: CountdownInfo;
}

export const CountdownDisplay: React.FC<CountdownDisplayProps> = ({ countdownInfo }) => {
  const { days, hours, minutes, seconds, isExpired } = countdownInfo;
  
  // Format with leading zeros
  const formatNumber = (num: number): string => num.toString().padStart(2, '0');
  
  if (isExpired) {
    return (
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-neon-pink font-bold text-xl"
        >
          ENCERRADO
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="grid grid-cols-4 gap-2 w-full">
        <TimeUnit value={days} label="Dias" />
        <TimeUnit value={hours} label="Horas" />
        <TimeUnit value={minutes} label="Min" />
        <TimeUnit value={seconds} label="Seg" />
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-400">
        {countdownInfo.formattedDate}
      </div>
    </div>
  );
};

interface TimeUnitProps {
  value: number;
  label: string;
}

const TimeUnit: React.FC<TimeUnitProps> = ({ value, label }) => {
  const formattedValue = value.toString().padStart(2, '0');
  
  return (
    <div className="flex flex-col items-center">
      <motion.div 
        key={value}
        initial={{ y: -5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-galaxy-deepPurple w-full text-center rounded-md border border-galaxy-purple/30 py-2"
      >
        <span className="text-lg font-bold text-neon-cyan">{formattedValue}</span>
      </motion.div>
      <span className="text-xs text-gray-400 mt-1">{label}</span>
    </div>
  );
}; 