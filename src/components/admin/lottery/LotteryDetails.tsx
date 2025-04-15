
import React, { useState } from 'react';
import { Award, Play, Pause, Edit, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PrizeTable from './PrizeTable';
import SpinningWheel from './SpinningWheel';
import { Lottery } from './LotteryList';
import { toastInfo } from "@/utils/toast";

interface LotteryDetailsProps {
  selectedLottery: Lottery;
  onStatusChange: (id: number, newStatus: string) => void;
}

const LotteryDetails: React.FC<LotteryDetailsProps> = ({ 
  selectedLottery,
  onStatusChange
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-neon-lime text-black">Ativo</Badge>;
      case 'pending': return <Badge className="bg-yellow-500 text-black">Pendente</Badge>;
      case 'completed': return <Badge className="bg-muted">Concluído</Badge>;
      default: return <Badge>Desconhecido</Badge>;
    }
  };

  const handleStatusChange = () => {
    setIsLoading(true);
    const newStatus = selectedLottery.status === 'active' ? 'pending' : 'active';
    
    // Simula um atraso na atualização de status
    setTimeout(() => {
      onStatusChange(selectedLottery.id, newStatus);
      setIsLoading(false);
    }, 600);
  };

  const handleEdit = () => {
    // Por enquanto, apenas mostra uma mensagem
    toastInfo("Funcionalidade em desenvolvimento", "A edição de sorteios será disponibilizada em breve.");
  };

  return (
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
                onClick={handleStatusChange}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="h-4 w-4 border-2 border-t-neon-cyan border-galaxy-purple rounded-full animate-spin mr-1"></span>
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
                className="border-neon-pink text-neon-pink hover:bg-neon-pink/20"
                onClick={handleEdit}
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
        <PrizeTable prizes={selectedLottery.prizes} isCompleted={selectedLottery.status === 'completed'} />
        <SpinningWheel selectedLottery={selectedLottery} />
      </div>
      
      {selectedLottery.prizes.length === 0 && (
        <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-md p-4 flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-500">Atenção</h4>
            <p className="text-sm text-muted-foreground">
              Este sorteio ainda não possui prêmios configurados. Adicione prêmios para que ele possa funcionar corretamente.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LotteryDetails;
