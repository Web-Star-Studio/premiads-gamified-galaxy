
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DollarSign, ChevronRight, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const CashbackPreview = () => {
  const navigate = useNavigate();
  
  // Mock cashback data
  const cashbackBalance = 57.25;
  const pendingCashback = 23.50;
  const totalSaved = 205.75;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-panel p-6 mt-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-heading">Seu Cashback</h2>
        <DollarSign className="w-5 h-5 text-neon-lime" />
      </div>
      
      <div className="bg-galaxy-deepPurple/50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-400">Saldo Disponível</p>
          <TrendingUp className="w-4 h-4 text-neon-lime" />
        </div>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold">R$ {cashbackBalance.toFixed(2)}</span>
          <span className="ml-2 text-xs bg-neon-lime/20 text-neon-lime px-2 py-0.5 rounded">
            +{pendingCashback.toFixed(2)} pendente
          </span>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Economia Total</p>
          <p className="font-medium">R$ {totalSaved.toFixed(2)}</p>
        </div>
        
        <div className="h-10 border-r border-galaxy-purple/30"></div>
        
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Última Compra</p>
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1 text-gray-400" />
            <p className="font-medium">12/04/2025</p>
          </div>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full justify-between mt-2 border-galaxy-purple/30 hover:bg-galaxy-deepPurple/50"
        onClick={() => navigate("/cashback")}
      >
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 mr-2" />
          <span>Ver Detalhes e Resgatar</span>
        </div>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </motion.div>
  );
};

export default CashbackPreview;
