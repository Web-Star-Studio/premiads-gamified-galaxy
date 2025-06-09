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
        setLotteries(data);
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
      const updatedLottery = await raffleService.updateRaffleStatus(lotteryId, newStatus);
      
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
      const success = await raffleService.deleteRaffle(lotteryId);
      
      if (success) {
        setLotteries(lotteries.filter(lottery => lottery.id !== lotteryId));
        
        if (selectedLottery?.id === lotteryId) {
          setSelectedLottery(null);
        }
        
        toast({
          title: "Sorteio excluído!",
          description: "O sorteio foi excluído com sucesso.",
        });
        
        playSound("success");
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
      // Invoke Supabase Edge Function to draw the raffle
      const { data: result, error } = await supabase.functions.invoke('draw-raffle', {
        body: { raffleId: lotteryId },
      });
      if (error) throw error;
      
      // Refresh the lotteries list
      const updatedLotteries = await raffleService.getRaffles();
      setLotteries(updatedLotteries);
      
      // Update the selected lottery
      const updatedLottery = await raffleService.getRaffleById(lotteryId);
      if (updatedLottery) setSelectedLottery(updatedLottery);
      
      // Show success toast
      toast({
        title: "Sorteio realizado!",
        description: (result as any).message || "O sorteio foi realizado com sucesso.",
      });
      playSound("reward");
    } catch (error) {
      console.error("Error drawing raffle:", error);
      toast({
        title: "Erro",
        description: (error as any).message || "Não foi possível realizar o sorteio.",
        variant: "destructive"
      });
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <LotteryList
            lotteries={lotteries}
            onViewDetails={setSelectedLottery}
            onEdit={handleEditLottery}
            onDelete={handleDeleteLottery}
          />
        </div>
        
        <div className="lg:col-span-2">
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
