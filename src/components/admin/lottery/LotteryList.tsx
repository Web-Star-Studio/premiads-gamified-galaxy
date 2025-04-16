
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, CheckCircle, Circle, Timer, Plus, FileSpreadsheet, Search, Filter, ArrowDown, Dice, Edit, Trash2, Eye } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from '@/lib/utils';
import NewLotteryDialog from './NewLotteryDialog';
import { Input } from '@/components/ui/input';
import { Lottery } from './types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { toastSuccess, toastInfo } from '@/utils/toast';
import { useSounds } from '@/hooks/use-sounds';

interface LotteryListProps {
  lotteries: Lottery[];
  selectedLotteryId: number | null;
  onSelectLottery: (lottery: Lottery) => void;
  onLotteryCreated: (lottery: Lottery) => void;
}

const LotteryList: React.FC<LotteryListProps> = ({ 
  lotteries: initialLotteries, 
  selectedLotteryId, 
  onSelectLottery,
  onLotteryCreated
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [lotteries, setLotteries] = useState(initialLotteries);
  const { playSound } = useSounds();
  
  // Filter lotteries based on search term and status
  const filteredLotteries = lotteries.filter(lottery => {
    const matchesSearch = lottery.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lottery.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': 
        return <Badge className="bg-green-500 text-black">Ativo</Badge>;
      case 'pending': 
        return <Badge className="bg-yellow-500 text-black">Rascunho</Badge>;
      case 'completed': 
        return <Badge className="bg-blue-500 text-black">Finalizado</Badge>;
      case 'canceled': 
        return <Badge className="bg-red-500 text-black">Cancelado</Badge>;
      default: 
        return <Badge>Desconhecido</Badge>;
    }
  };

  const handleEditClick = (e: React.MouseEvent, lottery: Lottery) => {
    e.stopPropagation();
    try {
      playSound('pop');
    } catch (error) {
      console.log("Som não reproduzido", error);
    }
    toastInfo("Edição", `A funcionalidade de edição para "${lottery.name}" será implementada em breve.`);
  };

  const handleViewClick = (e: React.MouseEvent, lottery: Lottery) => {
    e.stopPropagation();
    try {
      playSound('pop');
    } catch (error) {
      console.log("Som não reproduzido", error);
    }
    onSelectLottery(lottery);
  };

  const handleDeleteClick = (e: React.MouseEvent, lottery: Lottery) => {
    e.stopPropagation();
    try {
      playSound('error');
    } catch (error) {
      console.log("Som não reproduzido", error);
    }
    
    // Update the list after confirming
    const updatedLotteries = lotteries.filter(item => item.id !== lottery.id);
    setLotteries(updatedLotteries);
    toastSuccess("Removido", `O sorteio "${lottery.name}" foi removido com sucesso.`);
  };

  const handleSelectWinnerClick = (e: React.MouseEvent, lottery: Lottery) => {
    e.stopPropagation();
    try {
      playSound('reward');
    } catch (error) {
      console.log("Som não reproduzido", error);
    }
    
    // Mock winner selection
    const winner = {
      id: 1,
      name: "João Silva",
      avatar: "https://i.pravatar.cc/150?img=1"
    };
    
    // Update lottery with winner
    const updatedLotteries = lotteries.map(item => {
      if (item.id === lottery.id) {
        return { ...item, winner, status: 'completed' };
      }
      return item;
    });
    
    setLotteries(updatedLotteries);
    toastSuccess("Sorteio Realizado", `Parabéns a ${winner.name} por ganhar "${lottery.name}"!`);
  };

  const handleExportClick = () => {
    try {
      playSound('pop');
    } catch (error) {
      console.log("Som não reproduzido", error);
    }
    toastInfo("Exportar", "A funcionalidade de exportação será implementada em breve.");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Gerenciamento de Sorteios</h3>
      </div>
      
      <div className="flex flex-col md:flex-row gap-3 justify-between">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            className="pl-9 bg-galaxy-dark/50 border-galaxy-purple/20" 
            placeholder="Buscar sorteios..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-40">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 bg-galaxy-dark/50 border-galaxy-purple/20">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="pending">Rascunhos</SelectItem>
                <SelectItem value="completed">Finalizados</SelectItem>
                <SelectItem value="canceled">Cancelados</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 border-galaxy-purple/20"
              onClick={handleExportClick}
            >
              <FileSpreadsheet className="h-4 w-4" />
            </Button>
            
            <Button 
              className="bg-neon-pink hover:bg-neon-pink/90"
              onClick={() => setOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Sorteio
            </Button>
          </div>
        </div>
      </div>
      
      <NewLotteryDialog 
        open={open} 
        onOpenChange={setOpen}
        onLotteryCreated={(lottery) => {
          setLotteries([lottery, ...lotteries]);
          onLotteryCreated(lottery);
        }}
      />
      
      {filteredLotteries.length === 0 ? (
        <div className="text-center p-10 border border-dashed border-galaxy-purple/30 rounded-lg">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto w-16 h-16 rounded-full bg-neon-pink/10 flex items-center justify-center mb-4"
          >
            <Gift className="h-8 w-8 text-neon-pink" />
          </motion.div>
          <h3 className="text-lg font-medium mb-2">Nenhum sorteio encontrado</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? "Não encontramos sorteios com os filtros aplicados."
              : "Você ainda não possui sorteios. Crie seu primeiro sorteio!"}
          </p>
          <Button 
            onClick={() => setOpen(true)}
            className="bg-neon-pink hover:bg-neon-pink/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Sorteio
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLotteries.map((lottery) => (
            <motion.div
              key={lottery.id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <Card className="bg-galaxy-deepPurple/50 border-galaxy-purple/30 h-full">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      {getStatusBadge(lottery.status)}
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={(e) => handleViewClick(e, lottery)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={(e) => handleEditClick(e, lottery)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {lottery.status === 'active' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          onClick={(e) => handleSelectWinnerClick(e, lottery)}
                        >
                          <Dice className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground hover:text-red-500"
                        onClick={(e) => handleDeleteClick(e, lottery)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-white mt-2 line-clamp-1">{lottery.name}</h3>
                  
                  <div className="mt-2 text-xs text-muted-foreground">
                    <div className="flex justify-between mb-1">
                      <span>Tipo:</span>
                      <span className="text-white">{lottery.prizeType === 'electronics' ? 'Eletrônico' : 
                        lottery.prizeType === 'travel' ? 'Viagem' : 
                        lottery.prizeType === 'cash' ? 'Dinheiro' : 
                        lottery.prizeType === 'service' ? 'Serviço' : 
                        'Outro'}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Valor:</span>
                      <span className="text-white">R$ {lottery.prizeValue.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Números:</span>
                      <span className="text-white">{lottery.numbersSold} / {lottery.numbersTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pontos por número:</span>
                      <span className="text-white">{lottery.pointsPerNumber}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 mb-2">
                    <div className="h-2 w-full bg-galaxy-dark/70 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-neon-pink" 
                        style={{ width: `${lottery.progress || 0}%` }}
                      ></div>
                    </div>
                    <div className="mt-1 text-xs text-right text-muted-foreground">
                      {lottery.progress || 0}% vendido
                    </div>
                  </div>
                  
                  {lottery.winner && (
                    <div className="mt-3 p-2 bg-galaxy-purple/10 rounded-md">
                      <div className="text-xs font-medium mb-1">Ganhador:</div>
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full overflow-hidden mr-2">
                          <img src={lottery.winner.avatar} alt="Winner" className="h-full w-full object-cover" />
                        </div>
                        <span className="text-sm text-white">{lottery.winner.name}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-3 pt-3 border-t border-galaxy-purple/10 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        <span>Início:</span>
                      </div>
                      <span>{format(parseISO(lottery.startDate), 'dd/MM/yyyy', { locale: ptBR })}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <div className="flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        <span>Sorteio:</span>
                      </div>
                      <span>{format(parseISO(lottery.drawDate), 'dd/MM/yyyy', { locale: ptBR })}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LotteryList;
