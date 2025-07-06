import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Trophy, Users, Eye, MoreVertical, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { LotteryList } from "@/components/admin/lottery/LotteryList";
import LotteryDetails from "@/components/admin/lottery/LotteryDetails";
import NewLotteryDialog from "@/components/admin/lottery/NewLotteryDialog";
import EmptyState from "@/components/admin/lottery/EmptyState";
import { Lottery } from "@/types/lottery";
import raffleService from "@/services/raffles";
import { adminRaffleService } from "@/services/admin-raffles";
import { supabase } from '@/integrations/supabase/client'

const LotteryManagement = () => {
  const [selectedLottery, setSelectedLottery] = useState<Lottery | null>(null);
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const { playSound } = useSounds();

  // Fetch lotteries from service
  useEffect(() => {
    async function fetchLotteries() {
      setIsLoading(true);
      try {
        const data = await raffleService.getRaffles();
        
        // Filter out any lotteries with invalid IDs
        const validLotteries = data.filter(lottery => 
          lottery?.id && 
          lottery.id !== null && 
          lottery.id !== 'null' && 
          lottery.id !== 'undefined'
        );
        setLotteries(validLotteries);
      } catch (error) {
        console.error("Error fetching lotteries:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os sorteios.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchLotteries();
  }, []);

  const handleLotteryCreated = (newLottery: Lottery) => {
    setLotteries([...lotteries, newLottery]);
    setSelectedLottery(newLottery);
    toast({
      title: "Sorteio criado!",
      description: "O sorteio foi criado com sucesso.",
    });
  };

  const handleStatusChange = async (lotteryId: string, newStatus: Lottery['status']) => {
    try {
      const updatedLottery = await adminRaffleService.updateRaffleStatus(lotteryId, newStatus);
      
      if (updatedLottery) {
        setLotteries(lotteries.map(lottery => {
          if (lottery.id === lotteryId) {
            return updatedLottery;
          }
          return lottery;
        }));
        
        setSelectedLottery(updatedLottery);
        
        toast({
          title: "Status atualizado!",
          description: "O status do sorteio foi atualizado com sucesso.",
        });
        
        playSound("success");
      }
    } catch (error) {
      console.error("Error updating lottery status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do sorteio.",
        variant: "destructive"
      });
    }
  };

  const handleEditLottery = (lottery: Lottery) => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A edição de sorteios será disponibilizada em breve.",
    });
  };

  const handleDeleteLottery = async (lotteryId: string) => {
    try {
      // Validate ID first
      if (!lotteryId || lotteryId === 'null' || lotteryId === 'undefined') {
        toast({
          title: "Erro",
          description: "ID do sorteio inválido. Não é possível excluir.",
          variant: "destructive"
        });
        return;
      }
      
      const success = await adminRaffleService.deleteRaffle(lotteryId);
      
      if (success) {
        // Filter out the deleted lottery from the list
        const updatedLotteries = lotteries.filter(lottery => lottery.id !== lotteryId);
        setLotteries(updatedLotteries);
        
        // Clear selection if the deleted lottery was selected
        if (selectedLottery?.id === lotteryId) {
          setSelectedLottery(null);
        }
        
        toast({
          title: "Sorteio excluído!",
          description: "O sorteio foi excluído com sucesso.",
        });
        
        playSound("success");
      } else {
        toast({
          title: "Erro na exclusão",
          description: "Não foi possível excluir o sorteio. Verifique se ele existe.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error deleting lottery:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o sorteio.",
        variant: "destructive"
      });
    }
  };

  const handleDrawRaffle = async (lotteryId: string) => {
    try {
      // First check if there are participants for this lottery
      const { data: participants, error: participantsError } = await supabase
        .from('lottery_participants')
        .select('user_id, numbers')
        .eq('lottery_id', lotteryId);
      
      if (participantsError) {
        throw new Error(`Erro ao verificar participantes: ${participantsError.message}`);
      }
      
      // If no participants, show error message and exit
      if (!participants || participants.length === 0) {
        toast({
          title: "Erro",
          description: "Não há participantes com números válidos para este sorteio.",
          variant: "destructive"
        });
        return;
      }
      
      // Check if there are actual numbers assigned to participants
      const hasValidNumbers = participants.some(p => p.numbers && p.numbers.length > 0);
      if (!hasValidNumbers) {
        toast({
          title: "Erro",
          description: "Nenhum participante possui números válidos para sorteio.",
          variant: "destructive"
        });
        return;
      }

      // Use the new PostgreSQL function to draw the raffle with winner info
      const { data: result, error } = await supabase.rpc('draw_raffle_with_winner_info', {
        p_lottery_id: lotteryId
      });
      
      if (error) {
        let errorMessage = "Não foi possível realizar o sorteio.";
        if (error instanceof Error) {
          errorMessage = error.message;
        }

        toast({
          title: "Erro no Sorteio",
          description: errorMessage,
          variant: "destructive"
        });
        throw error;
      }

      // Check if the function execution was successful
      if (!result?.success) {
        const errorMessage = result?.error || "Erro desconhecido ao realizar sorteio.";
        toast({
          title: "Erro no Sorteio",
          description: errorMessage,
          variant: "destructive"
        });
        throw new Error(errorMessage);
      }
      
      // Update the selected lottery directly with the result data
      if (selectedLottery) {
        const updatedSelectedLottery = {
          ...selectedLottery,
          status: 'completed' as const,
          winning_number: result.winning_number,
          winner: result.winner || null
        };
        setSelectedLottery(updatedSelectedLottery);
      }
      
      // Refresh the lotteries list
      const updatedLotteries = await raffleService.getRaffles();
      setLotteries(updatedLotteries);
      
      // Show success toast with winner information
      toast({
        title: "Sorteio realizado!",
        description: result?.message || "O sorteio foi realizado com sucesso.",
      });
      playSound("reward");
    } catch (error) {
      console.error("Error drawing raffle:", error);
      // O toast já foi tratado acima, mas o catch previne que o erro quebre a aplicação.
      // E relançamos o erro para que o componente filho possa parar o estado de "loading".
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <div className="absolute inset-0 rounded-full border-4 border-t-neon-cyan border-galaxy-purple animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-4 border-t-neon-pink border-galaxy-purple animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <h2 className="text-xl font-heading">Carregando sorteios...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Administração de Sorteios</h1>
        <p className="text-gray-400">Gerencie todos os sorteios da plataforma</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-2">
          <LotteryList
            lotteries={lotteries}
            onViewDetails={setSelectedLottery}
            onEdit={handleEditLottery}
            onDelete={handleDeleteLottery}
          />
        </div>
        
        <div className="xl:col-span-3">
          {selectedLottery ? (
            <LotteryDetails
              selectedLottery={selectedLottery}
              onStatusChange={handleStatusChange}
              onDrawRaffle={handleDrawRaffle}
            />
          ) : (
            <EmptyState onNewLotteryClick={() => setShowNewDialog(true)} />
          )}
        </div>
      </div>

      <NewLotteryDialog
        open={showNewDialog}
        onOpenChange={setShowNewDialog}
        onLotteryCreated={handleLotteryCreated}
      />
    </div>
  );
};

export default LotteryManagement;
