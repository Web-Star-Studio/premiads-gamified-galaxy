
import React from 'react';
import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useSounds } from '@/hooks/use-sounds';

interface EmptyStateProps {
  onNewLotteryClick?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onNewLotteryClick }) => {
  const { playSound } = useSounds();

  const handleClick = () => {
    if (onNewLotteryClick) {
      try {
        playSound('pop');
      } catch (error) {
        console.log("Som não reproduzido", error);
      }
      onNewLotteryClick();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center p-10 text-center bg-galaxy-dark/30 rounded-lg border border-galaxy-purple/30 h-[400px] select-none"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.5 }}
        className="mb-4 bg-neon-pink/10 p-4 rounded-full"
      >
        <Gift className="h-12 w-12 text-neon-pink" />
      </motion.div>
      <h3 className="text-lg font-medium mb-2">Selecione um sorteio para visualizar seus detalhes.</h3>
      <p className="text-muted-foreground mb-6">
        Clique em um sorteio na lista ao lado ou crie um novo.
      </p>
      <Button
        variant="neon"
        onClick={handleClick}
        className="transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,0,200,0.5)]"
      >
        <Gift className="mr-2 h-4 w-4" />
        Criar Novo Sorteio
      </Button>
    </motion.div>
  );
};

export default EmptyState;
