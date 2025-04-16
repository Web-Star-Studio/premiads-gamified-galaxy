
import React from 'react';
import { motion } from 'framer-motion';
import Particles from './Particles';

interface LoadingScreenProps {
  message?: string;
  variant?: 'default' | 'minimal';
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Carregando...", 
  variant = 'default' 
}) => {
  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="relative w-10 h-10">
          <motion.div 
            className="absolute inset-0 rounded-full border-2 border-t-neon-cyan border-galaxy-purple/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <span className="ml-3 text-sm text-muted-foreground">{message}</span>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-galaxy-dark/90 backdrop-blur-sm">
      <Particles count={15} />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="relative w-20 h-20 mx-auto mb-6">
          <motion.div 
            className="absolute inset-0 rounded-full border-4 border-t-neon-cyan border-galaxy-purple/30" 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute inset-3 rounded-full border-4 border-t-neon-pink border-galaxy-purple/20"
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute inset-6 rounded-full border-4 border-t-neon-lime border-galaxy-purple/10"
            animate={{ rotate: 180 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        <motion.h2 
          className="text-xl font-heading bg-gradient-to-r from-neon-cyan to-neon-pink bg-clip-text text-transparent"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {message}
        </motion.h2>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
