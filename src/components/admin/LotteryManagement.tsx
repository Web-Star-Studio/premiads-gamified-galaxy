
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Gift, Plus, Edit, Trash2, Play, Pause, Award, Ticket, Dices, RotateCw, 
  Clock, Calendar, CheckCircle, XCircle, Switch, ChevronsUpDown 
} from 'lucide-react';
import LoadingParticles from './LoadingParticles';
import { useSounds } from '@/hooks/use-sounds';
import { toast } from '@/hooks/use-toast';

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

const LotteryManagement = () => {
  const [lotteries, setLotteries] = useState(initialLotteries);
  const [selectedLottery, setSelectedLottery] = useState<any | null>(null);
  const [previewActive, setPreviewActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [spinResult, setSpinResult] = useState<any | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const { playSound } = useSounds();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectLottery = (lottery: any) => {
    setSelectedLottery(lottery);
    setPreviewActive(false);
    setSpinResult(null);
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setLoading(true);
    
    setTimeout(() => {
      setLotteries(lotteries.map(lottery => 
        lottery.id === id ? { ...lottery, status: newStatus } : lottery
      ));
      
      const lottery = lotteries.find(l => l.id === id);
      if (lottery) {
        toast({
          title: `Status Alterado`,
          description: `O sorteio "${lottery.name}" foi ${
            newStatus === 'active' ? 'ativado' : 
            newStatus === 'pending' ? 'pausado' : 'finalizado'
          }.`,
        });
        
        playSound('pop');
      }
      
      setLoading(false);
    }, 800);
  };

  const startPreview = () => {
    if (!selectedLottery) return;
    
    setPreviewActive(true);
    playSound('chime');
    
    // Reset any previous result
    setSpinResult(null);
    
    // Start spinning
    if (wheelRef.current) {
      wheelRef.current.style.transition = 'transform 0.2s ease-in-out';
      wheelRef.current.style.transform = 'rotate(0deg)';
      
      setTimeout(() => {
        if (wheelRef.current) {
          // Random number of full rotations plus the position we want
          const randomRotations = 5 + Math.random() * 5; // 5-10 full rotations
          const totalDegrees = randomRotations * 360;
          
          wheelRef.current.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.83, 0.67)';
          wheelRef.current.style.transform = `rotate(${totalDegrees}deg)`;
          
          // Determine the prize after spinning
          setTimeout(() => {
            const prizes = selectedLottery.prizes;
            // Weight by probability
            const totalProbability = prizes.reduce((sum: number, prize: any) => sum + prize.probability, 0);
            const random = Math.random() * totalProbability;
            
            let cumulativeProbability = 0;
            let selectedPrize = prizes[0];
            
            for (const prize of prizes) {
              cumulativeProbability += prize.probability;
              if (random <= cumulativeProbability) {
                selectedPrize = prize;
                break;
              }
            }
            
            setSpinResult(selectedPrize);
            playSound('reward');
            
            toast({
              title: "Parabéns!",
              description: `Você ganhou: ${selectedPrize.name}`,
            });
          }, 4200); // Wait for the spin to finish
        }
      }, 100);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-slate-400 text-black';
      case 'uncommon': return 'bg-neon-cyan text-black';
      case 'rare': return 'bg-neon-lime text-black';
      case 'epic': return 'bg-purple-500 text-white';
      case 'legendary': return 'bg-neon-pink text-white';
      default: return 'bg-slate-400 text-black';
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-neon-lime text-black">Ativo</Badge>;
      case 'pending': return <Badge className="bg-yellow-500 text-black">Pendente</Badge>;
      case 'completed': return <Badge className="bg-muted">Concluído</Badge>;
      default: return <Badge>Desconhecido</Badge>;
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
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <Ticket className="h-4 w-4 mr-2 text-neon-cyan" />
                      Sorteios
                    </h3>
                    <Button className="bg-neon-pink hover:bg-neon-pink/80 text-white">
                      <Plus className="h-4 w-4 mr-1" />
                      Novo
                    </Button>
                  </div>
                  
                  <div className="space-y-3 max-h-[500px] overflow-y-auto fancy-scrollbar pr-2">
                    {lotteries.map(lottery => (
                      <div
                        key={lottery.id}
                        className={`p-3 rounded-md border cursor-pointer transition-all duration-200 ${
                          selectedLottery?.id === lottery.id 
                            ? 'border-neon-cyan bg-galaxy-dark/50 shadow-[0_0_10px_rgba(0,255,231,0.3)]' 
                            : 'border-galaxy-purple/30 hover:border-galaxy-purple/60'
                        }`}
                        onClick={() => handleSelectLottery(lottery)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{lottery.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              {lottery.startDate} - {lottery.endDate}
                            </div>
                          </div>
                          <div>{getStatusBadge(lottery.status)}</div>
                        </div>
                        <div className="mt-3 text-xs text-muted-foreground">
                          {lottery.prizes.length} prêmios configurados
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="lg:col-span-2">
                  {selectedLottery ? (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium flex items-center">
                          <Award className="h-5 w-5 mr-2 text-neon-lime" />
                          Detalhes do Sorteio
                        </h3>
                        
                        <div className="flex gap-2">
                          {selectedLottery.status !== 'completed' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-galaxy-purple/30"
                                onClick={() => handleStatusChange(
                                  selectedLottery.id, 
                                  selectedLottery.status === 'active' ? 'pending' : 'active'
                                )}
                              >
                                {selectedLottery.status === 'active' ? (
                                  <>
                                    <Pause className="h-4 w-4 mr-1" />
                                    Pausar
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-4 w-4 mr-1" />
                                    Ativar
                                  </>
                                )}
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-neon-pink text-neon-pink hover:bg-neon-pink/20"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Editar
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-galaxy-dark rounded-md p-4 border border-galaxy-purple/30 mb-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-xs text-muted-foreground">Nome</div>
                            <div className="font-medium">{selectedLottery.name}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Status</div>
                            <div>{getStatusBadge(selectedLottery.status)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Data Início</div>
                            <div className="font-medium">{selectedLottery.startDate}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Data Fim</div>
                            <div className="font-medium">{selectedLottery.endDate}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3 flex items-center">
                            <Dices className="h-4 w-4 mr-2 text-neon-pink" />
                            Prêmios e Probabilidades
                          </h4>
                          
                          <div className="bg-galaxy-dark rounded-md border border-galaxy-purple/30 overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Prêmio</TableHead>
                                  <TableHead>Raridade</TableHead>
                                  <TableHead>Chance</TableHead>
                                  <TableHead className="w-16"></TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {selectedLottery.prizes.map((prize: any) => (
                                  <TableRow key={prize.id}>
                                    <TableCell className="font-medium">{prize.name}</TableCell>
                                    <TableCell>
                                      <Badge className={getRarityColor(prize.rarity)}>
                                        {prize.rarity}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>{prize.probability}%</TableCell>
                                    <TableCell>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <ChevronsUpDown className="h-4 w-4" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          
                          {selectedLottery.status !== 'completed' && (
                            <Button
                              className="w-full mt-3 bg-neon-cyan text-galaxy-dark hover:bg-neon-cyan/80"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Adicionar Prêmio
                            </Button>
                          )}
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-3 flex items-center">
                            <RotateCw className="h-4 w-4 mr-2 text-neon-lime" />
                            Preview da Roleta
                          </h4>
                          
                          <div className="bg-galaxy-dark rounded-md border border-galaxy-purple/30 p-4 flex flex-col items-center">
                            <div className="relative w-48 h-48 mb-6">
                              {/* Spinning wheel */}
                              <div 
                                ref={wheelRef}
                                className="absolute inset-0 rounded-full border-4 border-neon-pink overflow-hidden"
                                style={{
                                  background: `conic-gradient(${
                                    selectedLottery.prizes.map((prize: any, index: number) => {
                                      const startPercent = selectedLottery.prizes
                                        .slice(0, index)
                                        .reduce((sum: number, p: any) => sum + p.probability, 0);
                                      const endPercent = startPercent + prize.probability;
                                      const color = prize.rarity === 'common' ? '#94A3B8' :
                                                    prize.rarity === 'uncommon' ? '#00FFE7' :
                                                    prize.rarity === 'rare' ? '#b4f10a' :
                                                    prize.rarity === 'epic' ? '#9b87f5' : '#FF00C8';
                                      return `${color} ${startPercent}%, ${color} ${endPercent}%`;
                                    }).join(', ')
                                  })`
                                }}
                              />
                              
                              {/* Center point */}
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full z-10" />
                              
                              {/* Pointer */}
                              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6">
                                <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[16px] border-l-transparent border-r-transparent border-b-white mx-auto" />
                              </div>
                            </div>
                            
                            {spinResult && (
                              <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center mb-4"
                              >
                                <Badge className={`${getRarityColor(spinResult.rarity)} text-lg px-3 py-1`}>
                                  {spinResult.name}
                                </Badge>
                              </motion.div>
                            )}
                            
                            <Button
                              className="bg-neon-lime text-galaxy-dark hover:bg-neon-lime/80"
                              onClick={startPreview}
                              disabled={previewActive}
                            >
                              <Play className="h-4 w-4 mr-1" />
                              {previewActive ? 'Girando...' : 'Testar Sorteio'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-20 text-muted-foreground">
                      <Gift className="h-16 w-16 mb-4 text-galaxy-purple/40" />
                      <p>Selecione um sorteio para visualizar seus detalhes.</p>
                      <Button
                        variant="outline"
                        className="mt-4 border-galaxy-purple/30"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Criar Novo Sorteio
                      </Button>
                    </div>
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
