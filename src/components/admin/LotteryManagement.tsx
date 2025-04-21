
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { useSounds } from '@/hooks/use-sounds';
import { toastSuccess } from '@/utils/toast';
import LoadingParticles from './LoadingParticles';
import LotteryList from './lottery/LotteryList';
import { Lottery } from './lottery/types';
import LotteryDetails from './lottery/LotteryDetails';

// Mock lottery data with proper type-safe status values
const initialLotteries: Lottery[] = [
  { 
    id: "1", 
    title: 'iPhone 15 Pro Max 256GB', 
    name: 'iPhone 15 Pro Max 256GB', // Add alias
    description: 'Sorteio do mais recente iPhone com armazenamento ampliado.', 
    detailed_description: 'O iPhone 15 Pro Max com memória de 256GB, cor Titanium Black, com 1 ano de garantia Apple, desbloqueado para todas as operadoras.', 
    detailedDescription: 'O iPhone 15 Pro Max com memória de 256GB, cor Titanium Black, com 1 ano de garantia Apple, desbloqueado para todas as operadoras.', // Add alias
    type: 'electronics', 
    prize_type: 'electronics',
    prizeType: 'electronics', // Add alias 
    prize_value: 9999, 
    prizeValue: 9999, // Add alias
    imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009284517', 
    start_date: '2025-04-15', 
    startDate: '2025-04-15', // Add alias
    end_date: '2025-04-22', 
    endDate: '2025-04-22', // Add alias
    draw_date: '2025-04-23',
    drawDate: '2025-04-23', // Add alias
    status: 'active',
    numbers_total: 1000,
    numbersTotal: 1000, // Add alias
    points: 100,
    pointsPerNumber: 100, // Add alias
    progress: 75,
    numbersSold: 750,
    numbers: [],
    created_at: '',
    updated_at: '',
    winner: null,
    prizes: []
  },
  { 
    id: "2", 
    title: 'PS5 Slim Digital Edition',
    name: 'PS5 Slim Digital Edition', // Add alias
    description: 'PlayStation 5 versão digital com jogo de lançamento.', 
    detailed_description: 'Console PlayStation 5 Slim Digital Edition, acompanha um controle DualSense e um jogo digital à escolha do ganhador no valor de até R$ 350.', 
    detailedDescription: 'Console PlayStation 5 Slim Digital Edition, acompanha um controle DualSense e um jogo digital à escolha do ganhador no valor de até R$ 350.', // Add alias
    type: 'electronics', 
    prize_type: 'electronics',
    prizeType: 'electronics', // Add alias
    prize_value: 3799, 
    prizeValue: 3799, // Add alias
    imageUrl: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=627&q=80', 
    start_date: '2025-04-17', 
    startDate: '2025-04-17', // Add alias
    end_date: '2025-04-24',
    endDate: '2025-04-24', // Add alias 
    draw_date: '2025-04-25',
    drawDate: '2025-04-25', // Add alias
    status: 'pending',
    numbers_total: 500,
    numbersTotal: 500, // Add alias
    points: 50,
    pointsPerNumber: 50, // Add alias
    progress: 0,
    numbersSold: 0,
    numbers: [],
    created_at: '',
    updated_at: '',
    winner: null,
    prizes: []
  },
  { 
    id: "3", 
    title: 'Pacote Viagem Cancún',
    name: 'Pacote Viagem Cancún', // Add alias
    description: 'Semana completa em Cancún para duas pessoas, tudo incluso.', 
    detailed_description: 'Passagem aérea de ida e volta para duas pessoas, 7 noites em hotel 5 estrelas em regime all-inclusive, traslados e seguro viagem inclusos. Válido para utilização em até 12 meses após o sorteio.', 
    detailedDescription: 'Passagem aérea de ida e volta para duas pessoas, 7 noites em hotel 5 estrelas em regime all-inclusive, traslados e seguro viagem inclusos. Válido para utilização em até 12 meses após o sorteio.', // Add alias
    type: 'travel', 
    prize_type: 'travel',
    prizeType: 'travel', // Add alias
    prize_value: 15000, 
    prizeValue: 15000, // Add alias
    imageUrl: 'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    start_date: '2025-04-01', 
    startDate: '2025-04-01', // Add alias
    end_date: '2025-04-10', 
    endDate: '2025-04-10', // Add alias
    draw_date: '2025-04-12',
    drawDate: '2025-04-12', // Add alias
    status: 'completed',
    numbers_total: 2000,
    numbersTotal: 2000, // Add alias
    points: 200,
    pointsPerNumber: 200, // Add alias
    progress: 100,
    numbersSold: 2000,
    numbers: [],
    created_at: '',
    updated_at: '',
    winner: {
      id: "2",
      name: "Maria Oliveira",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    prizes: []
  },
  { 
    id: "4", 
    title: 'MacBook Air M3',
    name: 'MacBook Air M3', // Add alias
    description: 'O laptop mais fino e leve da Apple com o novo chip M3.', 
    detailed_description: 'MacBook Air com chip M3, tela de 13.6", 16GB de RAM e 512GB de SSD. Acompanha carregador de 35W com duas portas USB-C e 1 ano de garantia Apple.', 
    detailedDescription: 'MacBook Air com chip M3, tela de 13.6", 16GB de RAM e 512GB de SSD. Acompanha carregador de 35W com duas portas USB-C e 1 ano de garantia Apple.', // Add alias
    type: 'electronics', 
    prize_type: 'electronics',
    prizeType: 'electronics', // Add alias
    prize_value: 12999, 
    prizeValue: 12999, // Add alias
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFjYm9vayUyMGFpcnxlbnwwfHwwfHx8MA%3D%3D', 
    start_date: '2025-04-28', 
    startDate: '2025-04-28', // Add alias
    end_date: '2025-05-28', 
    endDate: '2025-05-28', // Add alias
    draw_date: '2025-05-30',
    drawDate: '2025-05-30', // Add alias
    status: 'pending',
    numbers_total: 1500,
    numbersTotal: 1500, // Add alias
    points: 150,
    pointsPerNumber: 150, // Add alias
    progress: 0,
    numbersSold: 0,
    numbers: [],
    created_at: '',
    updated_at: '',
    winner: null,
    prizes: []
  },
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
      playSound('pop');
    } catch (error) {
      console.log("Som não reproduzido", error);
    }
  };

  const handleStatusChange = (id: string, newStatus: 'active' | 'pending' | 'completed' | 'canceled') => {
    setLoading(true);
    
    setTimeout(() => {
      setLotteries(lotteries.map(lottery => 
        lottery.id === id ? { ...lottery, status: newStatus } : lottery
      ));
      
      const lottery = lotteries.find(l => l.id === id);
      if (lottery) {
        toastSuccess(
          `Status Alterado`,
          `O sorteio "${lottery.title}" foi ${
            newStatus === 'active' ? 'ativado' : 
            newStatus === 'pending' ? 'pausado' : 
            newStatus === 'completed' ? 'finalizado' : 'cancelado'
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
      playSound('reward');
    } catch (error) {
      console.log("Som não reproduzido", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <motion.div 
            className="flex justify-center items-center h-60 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingParticles />
            <div className="w-12 h-12 border-4 border-t-neon-pink border-galaxy-purple rounded-full animate-spin"></div>
            <div className="mt-20 text-muted-foreground">Carregando sorteios...</div>
          </motion.div>
        ) : (
          <Card className="bg-galaxy-deepPurple border-galaxy-purple/30">
            <CardContent className="p-6">
              <LotteryList 
                lotteries={lotteries} 
                selectedLotteryId={selectedLottery?.id || null}
                onSelectLottery={handleSelectLottery}
                onLotteryCreated={handleLotteryCreated}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
};

export default LotteryManagement;
