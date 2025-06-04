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

const LotteryManagement = () => {
  const [selectedLottery, setSelectedLottery] = useState<Lottery | null>(null);
  const [lotteries, setLotteries] = useState<Lottery[]>([
    {
      id: "1",
      title: "Sorteio Semanal de Pontos",
      name: "Sorteio Semanal de Pontos",
      description: "Sorteio semanal com prêmios incríveis para os participantes mais ativos",
      detailed_description: "Um sorteio especial que acontece toda semana, oferecendo prêmios exclusivos para quem participa ativamente da plataforma.",
      detailedDescription: "Um sorteio especial que acontece toda semana, oferecendo prêmios exclusivos para quem participa ativamente da plataforma.",
      type: "regular",
      tickets_reward: 100,
      numbers_total: 1000,
      numbersTotal: 1000,
      status: "active" as const,
      start_date: "2025-01-15T00:00:00Z",
      startDate: "2025-01-15T00:00:00Z",
      end_date: "2025-01-22T23:59:59Z",
      endDate: "2025-01-22T23:59:59Z",
      draw_date: "2025-01-23T20:00:00Z",
      drawDate: "2025-01-23T20:00:00Z",
      prize_type: "electronics",
      prizeType: "electronics",
      prize_value: 2500,
      prizeValue: 2500,
      pointsPerNumber: 10,
      minPoints: 100,
      imageUrl: "",
      winner: null,
      created_at: "2025-01-01T00:00:00Z",
      updated_at: "2025-01-01T00:00:00Z",
      numbers: [],
      progress: 45,
      numbersSold: 450,
      prizes: [
        { id: 1, name: "Smartphone Premium", rarity: "legendary", probability: 5 },
        { id: 2, name: "Fone Bluetooth", rarity: "rare", probability: 20 },
        { id: 3, name: "Pontos Bonus", rarity: "common", probability: 75 }
      ]
    },
    {
      id: "2",
      title: "Loot Box Especial",
      name: "Loot Box Especial",
      description: "Participe e concorra a prêmios exclusivos em nossa Loot Box especial",
      detailed_description: "Uma oportunidade única de ganhar itens raros e valiosos. Cada Loot Box contém prêmios incríveis, desde créditos até itens exclusivos.",
      detailedDescription: "Uma oportunidade única de ganhar itens raros e valiosos. Cada Loot Box contém prêmios incríveis, desde créditos até itens exclusivos.",
      type: "lootbox",
      tickets_reward: 50,
      numbers_total: 500,
      numbersTotal: 500,
      status: "pending" as const,
      start_date: "2025-02-01T00:00:00Z",
      startDate: "2025-02-01T00:00:00Z",
      end_date: "2025-02-15T23:59:59Z",
      endDate: "2025-02-15T23:59:59Z",
      draw_date: "2025-02-16T20:00:00Z",
      drawDate: "2025-02-16T20:00:00Z",
      prize_type: "items",
      prizeType: "items",
      prize_value: 100,
      prizeValue: 100,
      pointsPerNumber: 5,
      minPoints: 50,
      imageUrl: "",
      winner: null,
      created_at: "2025-01-20T00:00:00Z",
      updated_at: "2025-01-20T00:00:00Z",
      numbers: [],
      progress: 20,
      numbersSold: 100,
      prizes: [
        { id: 4, name: "Espada Ancestral", rarity: "epic", probability: 10 },
        { id: 5, name: "Poção de Mana", rarity: "uncommon", probability: 30 },
        { id: 6, name: "Créditos", rarity: "common", probability: 60 }
      ]
    },
    {
      id: "3",
      title: "Promoção de Aniversário",
      name: "Promoção de Aniversário",
      description: "Comemore conosco e concorra a prêmios incríveis em nosso sorteio de aniversário",
      detailed_description: "Em celebração ao nosso aniversário, estamos sorteando prêmios exclusivos para nossos clientes mais fiéis. Participe e concorra!",
      detailedDescription: "Em celebração ao nosso aniversário, estamos sorteando prêmios exclusivos para nossos clientes mais fiéis. Participe e concorra!",
      type: "special",
      tickets_reward: 200,
      numbers_total: 2000,
      numbersTotal: 2000,
      status: "completed" as const,
      start_date: "2025-03-01T00:00:00Z",
      startDate: "2025-03-01T00:00:00Z",
      end_date: "2025-03-15T23:59:59Z",
      endDate: "2025-03-15T23:59:59Z",
      draw_date: "2025-03-16T20:00:00Z",
      drawDate: "2025-03-16T20:00:00Z",
      prize_type: "travel",
      prizeType: "travel",
      prize_value: 5000,
      prizeValue: 5000,
      pointsPerNumber: 20,
      minPoints: 200,
      imageUrl: "",
      winner: {
        id: "user123",
        name: "Maria Silva",
        avatar: "https://example.com/avatar.jpg"
      },
      created_at: "2025-02-15T00:00:00Z",
      updated_at: "2025-02-15T00:00:00Z",
      numbers: [],
      progress: 100,
      numbersSold: 2000,
      prizes: [
        { id: 7, name: "Viagem para o Caribe", rarity: "legendary", probability: 5 },
        { id: 8, name: "Estadia em Hotel de Luxo", rarity: "rare", probability: 15 },
        { id: 9, name: "Jantar em Restaurante", rarity: "common", probability: 80 }
      ]
    }
  ]);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const { playSound } = useSounds();

  const handleLotteryCreated = (newLottery: Lottery) => {
    setLotteries([...lotteries, newLottery]);
    toast({
      title: "Sorteio criado!",
      description: "O sorteio foi criado com sucesso.",
    });
  };

  const handleStatusChange = (lotteryId: string, newStatus: Lottery['status']) => {
    setLotteries(lotteries.map(lottery => {
      if (lottery.id === lotteryId) {
        return { ...lottery, status: newStatus };
      }
      return lottery;
    }));
    setSelectedLottery(lotteries.find(lottery => lottery.id === lotteryId) || null);
    toast({
      title: "Status atualizado!",
      description: "O status do sorteio foi atualizado com sucesso.",
    });
  };

  const handleEditLottery = (lottery: Lottery) => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A edição de sorteios será disponibilizada em breve.",
    });
  };

  const handleDeleteLottery = (lotteryId: string) => {
    setLotteries(lotteries.filter(lottery => lottery.id !== lotteryId));
    setSelectedLottery(null);
    toast({
      title: "Sorteio excluído!",
      description: "O sorteio foi excluído com sucesso.",
    });
  };

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
