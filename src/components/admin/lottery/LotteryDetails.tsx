import React, { useState } from 'react';
import { Award, Play, Pause, Edit, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PrizeTable from './PrizeTable';
import RandomNumberGenerator from './RandomNumberGenerator';
import { Lottery } from './types';
import { toastInfo } from "@/utils/toast";
import { motion } from 'framer-motion';
import ButtonLoadingSpinner from '@/components/ui/ButtonLoadingSpinner';
import { useSounds } from '@/hooks/use-sounds';

interface LotteryDetailsProps {
  selectedLottery: Lottery;
  onStatusChange: (id: string, newStatus: string) => void;
  onDrawRaffle: (id: string) => Promise<void>;
}

const LotteryDetails: React.FC<LotteryDetailsProps> = ({ 
  selectedLottery,
  onStatusChange,
  onDrawRaffle
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { playSound } = useSounds();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-neon-lime text-black">Ativo</Badge>;
      case 'pending': return <Badge className="bg-yellow-500 text-black">Pendente</Badge>;
      case 'completed': return <Badge className="bg-muted">Concluído</Badge>;
      default: return <Badge>Desconhecido</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Não definida';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = date.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const formattedDate = date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      // Adicionar informação relativa se for próximo
      if (diffDays === 0) {
        return `${formattedDate} (hoje)`;
      } else if (diffDays === 1) {
        return `${formattedDate} (amanhã)`;
      } else if (diffDays === -1) {
        return `${formattedDate} (ontem)`;
      } else if (diffDays > 0 && diffDays <= 7) {
        return `${formattedDate} (em ${diffDays} dias)`;
      } else if (diffDays < 0 && diffDays >= -7) {
        return `${formattedDate} (${Math.abs(diffDays)} dias atrás)`;
      }
      
      return formattedDate;
    } catch (error) {
      return 'Data inválida';
    }
  };

  const getLotteryDisplayName = () => {
    return selectedLottery.name || selectedLottery.title || 'Sorteio sem nome';
  };

  const handleStatusChange = () => {
    try {
      playSound('pop');
    } catch (error) {
      console.log("Som não reproduzido", error);
    }
    
    setIsLoading(true);
    const newStatus = selectedLottery.status === 'active' ? 'pending' : 'active';
    
    // Simula um atraso na atualização de status
    setTimeout(() => {
      onStatusChange(selectedLottery.id, newStatus);
      setIsLoading(false);
    }, 600);
  };

  const handleEdit = () => {
    try {
      playSound('pop');
    } catch (error) {
      console.log("Som não reproduzido", error);
    }
    
    // Por enquanto, apenas mostra uma mensagem
    toastInfo("Funcionalidade em desenvolvimento", "A edição de sorteios será disponibilizada em breve.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
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
                className="border-galaxy-purple/30 transition-all duration-200"
                onClick={handleStatusChange}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <ButtonLoadingSpinner />
                    Atualizando...
                  </span>
                ) : selectedLottery.status === 'active' ? (
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
                className="border-neon-pink text-neon-pink hover:bg-neon-pink/20 transition-all duration-200"
                onClick={handleEdit}
                disabled={isLoading}
              >
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Button>
            </>
          )}
        </div>
      </div>
      
      <motion.div 
        className="bg-galaxy-dark rounded-md p-4 border border-galaxy-purple/30 mb-6"
        whileHover={{ boxShadow: "0 0 8px rgba(155, 135, 245, 0.3)" }}
        transition={{ duration: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div className="space-y-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Nome do Sorteio</div>
              <div className="font-medium text-base">{getLotteryDisplayName()}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Status</div>
              <div>{getStatusBadge(selectedLottery.status)}</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="text-xs text-muted-foreground mb-2 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Data de Início
              </div>
              <div className="bg-gradient-to-r from-neon-cyan/10 to-neon-lime/10 rounded-lg px-4 py-3 border border-neon-cyan/30 hover:border-neon-cyan/50 transition-colors">
                <div className="font-medium text-sm text-neon-cyan">
                  {formatDate(selectedLottery.start_date)}
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-2 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Data de Término
              </div>
              <div className="bg-gradient-to-r from-neon-pink/10 to-neon-purple/10 rounded-lg px-4 py-3 border border-neon-pink/30 hover:border-neon-pink/50 transition-colors">
                <div className="font-medium text-sm text-neon-pink">
                  {formatDate(selectedLottery.end_date)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PrizeTable 
          prizes={selectedLottery.prizes || []} 
          isCompleted={selectedLottery.status === 'completed'}
          lotteryPrize={{
            prize_type: selectedLottery.prize_type || selectedLottery.prizeType,
            prize_value: selectedLottery.prize_value || selectedLottery.prizeValue,
            image_url: selectedLottery.image_url || selectedLottery.imageUrl
          }}
        />
        <RandomNumberGenerator selectedLottery={selectedLottery} onDrawRaffle={onDrawRaffle} />
      </div>
      
      {(!selectedLottery.prize_type || !selectedLottery.prize_value) && (!selectedLottery.prizes || selectedLottery.prizes.length === 0) && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-md p-4 flex items-start"
        >
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-500">Atenção</h4>
            <p className="text-sm text-muted-foreground">
              Este sorteio ainda não possui prêmios configurados. Adicione prêmios para que ele possa funcionar corretamente.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LotteryDetails;
