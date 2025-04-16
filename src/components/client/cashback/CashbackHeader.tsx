
import React from 'react';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import ClientDashboardHeader from '@/components/client/ClientDashboardHeader';

interface CashbackHeaderProps {
  userName: string | null;
  userCashback: number;
}

const CashbackHeader: React.FC<CashbackHeaderProps> = ({ userName, userCashback }) => {
  return (
    <>
      <ClientDashboardHeader 
        title="Marketplace de Cashback" 
        userName={userName} 
        showBackButton
        backTo="/cliente"
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-6 flex items-center bg-galaxy-deepPurple/50 px-4 py-3 rounded-lg border border-galaxy-purple/30"
      >
        <Wallet className="w-8 h-8 text-neon-lime mr-3" />
        <div>
          <p className="text-sm text-gray-400">Saldo Disponível</p>
          <p className="text-2xl font-semibold">
            R$ {userCashback.toFixed(2)}
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default CashbackHeader;
