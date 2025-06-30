import React, { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lottery } from './types';
import { toastInfo, toastSuccess, toastError } from "@/utils/toast";
import { useSounds } from '@/hooks/use-sounds';

interface RandomNumberGeneratorProps {
  selectedLottery: Lottery;
  onDrawRaffle: (lotteryId: string) => Promise<void>;
}

const RandomNumberGenerator: React.FC<RandomNumberGeneratorProps> = ({ 
  selectedLottery,
  onDrawRaffle
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [winningNumber, setWinningNumber] = useState<number | null>(null);
  const [winnerInfo, setWinnerInfo] = useState<{name: string; id: string} | null>(null);
  const { playSound } = useSounds();
  
  // Determina o range de números com base no sorteio
  const minNumber = selectedLottery.number_range?.min || 1;
  const maxNumber = selectedLottery.number_range?.max || selectedLottery.numbers_total;
  
  // Monitora mudanças na loteria para capturar resultado do sorteio
  useEffect(() => {
    if (selectedLottery.status === 'completed' && selectedLottery.winning_number && isGenerating) {
      // A loteria foi completada durante um sorteio ativo
      setTimeout(() => {
        setIsGenerating(false);
        setWinningNumber(selectedLottery.winning_number);
        
        // Captura informações do ganhador se disponível
        if (selectedLottery.winner && typeof selectedLottery.winner === 'object' && selectedLottery.winner.name) {
          setWinnerInfo({
            name: selectedLottery.winner.name,
            id: selectedLottery.winner.id
          });
        }
      }, 1000);
    }
  }, [selectedLottery.status, selectedLottery.winning_number, selectedLottery.winner, isGenerating]);
  
  const handleDrawRaffle = async () => {
    if (isGenerating) return;
    
    try {
      playSound('pop');
    } catch (error) {
      console.log("Som não reproduzido", error);
    }
    
    setShowDialog(true);
    setIsGenerating(true);
    setWinningNumber(null);
    setWinnerInfo(null);
    
    // Animação de números aleatórios
    let duration = 3000; // 3 segundos
    const interval = 80; // Intervalo entre cada número
    const startTime = Date.now();
    
    const generateRandomNumbers = () => {
      const elapsedTime = Date.now() - startTime;
      const randomNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
      setCurrentNumber(randomNumber);
      
      // Desacelera a animação perto do final
      if (elapsedTime < duration) {
        const timeLeft = duration - elapsedTime;
        const nextInterval = timeLeft < 1000 ? interval + (1000 - timeLeft) / 10 : interval;
        setTimeout(generateRandomNumbers, nextInterval);
      } else {
        // Finaliza o sorteio e chama a API
        try {
          playSound('reward');
        } catch (error) {
          console.log("Som não reproduzido", error);
        }
        
        // Finaliza a animação
        handleFinalizeRaffle();
      }
    };
    
    generateRandomNumbers();
  };
  
  const handleFinalizeRaffle = async () => {
    try {
      // Chama a função que realizará o sorteio no backend
      await onDrawRaffle(selectedLottery.id);
      
      // O useEffect irá detectar a mudança na loteria e atualizar os estados
    } catch (error) {
      console.error("Erro ao finalizar o sorteio:", error);
      // Qualquer erro agora interrompe o processo
      setIsGenerating(false);
      setShowDialog(false);
      // O toast de erro já foi exibido pelo componente `LotteryManagement`
    }
  };
  
  const handleCloseDialog = () => {
    if (!isGenerating) {
      setShowDialog(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Gerador de Números</h3>
      
      <div className="relative flex flex-col items-center justify-center aspect-square bg-galaxy-dark rounded-lg border border-galaxy-purple/30 p-6">
        {/* Visualização do range de números */}
        <div className="absolute top-4 left-4 text-xs text-muted-foreground">
          Range: {minNumber} - {maxNumber}
        </div>
        
        {/* Caixa central com número */}
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="text-center p-6 bg-galaxy-dark border-2 border-neon-cyan rounded-lg flex flex-col items-center justify-center w-48 h-48">
            <div className="text-2xl text-muted-foreground mb-2">Número</div>
            {selectedLottery.winning_number ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center"
              >
                <div className="text-5xl font-bold text-neon-lime mb-2">
                  {selectedLottery.winning_number}
                </div>
                {selectedLottery.winner && typeof selectedLottery.winner === 'object' && selectedLottery.winner.name && (
                  <div className="bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg px-4 py-2">
                    <div className="text-sm text-neon-cyan font-medium">
                      🎉 {selectedLottery.winner.name}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="text-5xl font-bold text-muted-foreground">?</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button
          onClick={handleDrawRaffle}
          disabled={isGenerating || selectedLottery.status === 'completed'}
          className="bg-neon-lime text-black hover:bg-neon-lime/80"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Realizar Sorteio
        </Button>
      </div>
      
      {/* Dialog de animação do sorteio */}
      <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-md bg-galaxy-dark border-galaxy-purple/50">
          <DialogHeader>
            <DialogTitle>Sorteio em andamento</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-10">
            <div className="text-center">
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div
                    key="generating"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center"
                  >
                    <div className="text-6xl font-bold text-neon-lime mb-4 min-h-[100px]">
                      {currentNumber}
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="h-8 w-8 text-neon-cyan" />
                    </motion.div>
                    <p className="mt-4 text-lg">Sorteando...</p>
                  </motion.div>
                ) : winningNumber ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center"
                  >
                    {/* Resultado do sorteio com número e vencedor */}
                    <div className="flex flex-col items-center space-y-4 mb-6">
                      <div className="text-7xl font-bold text-neon-lime min-h-[100px] flex items-center">
                        {winningNumber}
                      </div>
                      
                      {winnerInfo ? (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="bg-galaxy-purple/20 border border-neon-cyan/30 rounded-lg px-6 py-3"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
                            <div>
                              <p className="text-sm text-muted-foreground">Vencedor</p>
                              <p className="text-lg font-semibold text-neon-cyan">{winnerInfo.name}</p>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="text-lg text-muted-foreground">Número sorteado!</div>
                      )}
                    </div>
                    
                    {winnerInfo && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-center text-neon-lime mb-4"
                      >
                        🎉 <strong>Parabéns {winnerInfo.name}!</strong>
                      </motion.p>
                    )}
                    
                    <Button 
                      className="mt-4" 
                      onClick={handleCloseDialog}
                    >
                      Fechar
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center"
                  >
                    <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
                    <p className="text-lg">Ocorreu um erro no sorteio.</p>
                    <Button 
                      className="mt-6" 
                      onClick={handleCloseDialog}
                    >
                      Fechar
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RandomNumberGenerator; 