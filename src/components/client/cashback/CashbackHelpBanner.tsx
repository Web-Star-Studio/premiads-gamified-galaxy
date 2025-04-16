
import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CashbackHelpBanner: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-12 p-4 sm:p-6 rounded-lg border border-galaxy-purple/30 bg-galaxy-deepPurple/30"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="p-3 rounded-full bg-neon-pink/10">
          <Info className="h-6 w-6 text-neon-pink" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-1">Como funciona o resgate de cashback?</h3>
          <p className="text-gray-400">Escolha um cupom, resgate seu cashback e receba um código promocional para usar na loja do anunciante.</p>
        </div>
        <Button 
          variant="outline" 
          className="whitespace-nowrap mt-3 sm:mt-0"
          onClick={() => navigate("/faq")}
        >
          Saiba Mais
        </Button>
      </div>
    </motion.div>
  );
};

export default CashbackHelpBanner;
