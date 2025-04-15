
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift } from 'lucide-react';
import { useSounds } from '@/hooks/use-sounds';
import { toastSuccess } from '@/utils/toast';
import LoadingParticles from './LoadingParticles';
import LotteryList, { Lottery } from './lottery/LotteryList';
import LotteryDetails from './lottery/LotteryDetails';
import EmptyState from './lottery/EmptyState';

// Mock lottery data
const initialLotteries = [
  { 
    id: 1, 
    name: 'Sorteio Semanal de Pontos', 
    startDate: '2025-04-15', 
    endDate: '2025-04-22', 
    status: 'active',
    prizes: [
      { id: 1, name: '5000 Pontos', rarity: 'common', probability: 60 },
      { id: 2, name: '10000 Pontos', rarity: 'uncommon', probability: 30 },
      { id: 3, name: 'Premium por 1 mês', rarity: 'rare', probability: 10 }
    ]
  },
  { 
    id: 2, 
    name: 'Loot Box Especial', 
    startDate: '2025-04-17', 
    endDate: '2025-04-24', 
    status: 'pending',
    prizes: [
      { id: 4, name: 'Skin Exclusiva', rarity: 'common', probability: 55 },
      { id: 5, name: 'Título Raro', rarity: 'uncommon', probability: 35 },
      { id: 6, name: 'Pacote VIP', rarity: 'legendary', probability: 10 }
    ]
  },
  { 
    id: 3, 
    name: 'Promoção de Aniversário', 
    startDate: '2025-04-01', 
    endDate: '2025-04-10', 
    status: 'completed',
    prizes: [
      { id: 7, name: 'Desconto 10%', rarity: 'common', probability: 70 },
      { id: 8, name: 'Desconto 25%', rarity: 'rare', probability: 25 },
      { id: 9, name: 'Produto Grátis', rarity: 'legendary', probability: 5 }
    ]
  }
];

const LotteryManagement: React.FC = () => {
  const [lotteries, setLotteries] = useState<Lottery[]>(initialLotteries);
  const [selectedLottery, setSelectedLottery] = useState<Lottery | null>(null);
  const [loading, setLoading] = useState(true);
  const { playSound } = useSounds();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectLottery = (lottery: Lottery) => {
    setSelectedLottery(lottery);
    
    // Toque um som ao selecionar
    try {
      playSound('click');
    } catch (error) {
      console.log("Som não reproduzido", error);
    }
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setLoading(true);
    
    setTimeout(() => {
      setLotteries(lotteries.map(lottery => 
        lottery.id === id ? { ...lottery, status: newStatus } : lottery
      ));
      
      const lottery = lotteries.find(l => l.id === id);
      if (lottery) {
        toastSuccess(
          `Status Alterado`,
          `O sorteio "${lottery.name}" foi ${
            newStatus === 'active' ? 'ativado' : 
            newStatus === 'pending' ? 'pausado' : 'finalizado'
          }.`
        );
        
        try {
          playSound('pop');
        } catch (error) {
          console.log("Som não reproduzido", error);
        }
      }
      
      setLoading(false);
    }, 800);
  };

  const handleLotteryCreated = (newLottery: Lottery) => {
    // Adicionar o novo sorteio à lista
    setLotteries([newLottery, ...lotteries]);
    
    // Selecionar o novo sorteio
    setSelectedLottery(newLottery);
    
    // Tocar som de sucesso
    try {
      playSound('success');
    } catch (error) {
      console.log("Som não reproduzido", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-galaxy-deepPurple border-galaxy-purple/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-heading text-white flex items-center">
              <Gift className="h-5 w-5 mr-2 text-neon-pink" />
              Administração de Sorteios
            </CardTitle>
            <CardDescription>
              Gerencie loot boxes, prêmios e probabilidades de sorteios.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-60 relative">
                <LoadingParticles />
                <div className="w-12 h-12 border-4 border-t-neon-pink border-galaxy-purple rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <LotteryList 
                    lotteries={lotteries} 
                    selectedLotteryId={selectedLottery?.id || null}
                    onSelectLottery={handleSelectLottery}
                    onLotteryCreated={handleLotteryCreated}
                  />
                </div>
                
                <div className="lg:col-span-2">
                  {selectedLottery ? (
                    <LotteryDetails 
                      selectedLottery={selectedLottery}
                      onStatusChange={handleStatusChange}
                    />
                  ) : (
                    <EmptyState />
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default LotteryManagement;
