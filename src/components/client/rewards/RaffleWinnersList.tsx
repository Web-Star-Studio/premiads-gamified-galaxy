import React from "react";
import { motion } from "framer-motion";
import { Award, Calendar, Gift, Tag, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";

interface RaffleWinner {
  id: string;
  lottery_id: string;
  user_id: string;
  winning_number: number;
  prize_name: string;
  prize_value: number;
  created_at: string;
  raffle: {
    id: string;
    name: string;
    title: string;
    description: string;
    image_url?: string;
    prize_type: string;
    prize_value: number;
    status: string;
  };
}

interface RaffleWinnersListProps {
  winners: RaffleWinner[];
  loading?: boolean;
}

function RaffleWinnersList({ winners, loading = false }: RaffleWinnersListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="w-10 h-10 border-4 border-t-neon-cyan border-galaxy-purple rounded-full animate-spin"></div>
      </div>
    );
  }

  if (winners.length === 0) {
    return (
      <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/20">
        <CardContent className="pt-6 text-center">
          <div className="w-20 h-20 mx-auto bg-galaxy-deepPurple/40 rounded-full flex items-center justify-center">
            <Trophy className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-white mt-4">Nenhum Prêmio de Sorteio</h3>
          <p className="text-gray-400 mt-2">
            Você ainda não ganhou nenhum sorteio. Participe dos sorteios ativos para ter a chance de ganhar!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {winners.map((winner) => (
        <motion.div
          key={winner.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden border-galaxy-purple/30 bg-galaxy-deepPurple/20 hover:bg-galaxy-deepPurple/30 transition-all">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/4 bg-gradient-to-br from-neon-cyan/20 to-neon-pink/20 p-4 flex items-center justify-center">
                  <div className="rounded-full bg-galaxy-deepPurple/40 p-6">
                    <Trophy className="w-12 h-12 text-neon-lime" />
                  </div>
                </div>
                
                <div className="p-4 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                    <div>
                      <Badge className="bg-neon-lime text-black mb-2">Vencedor!</Badge>
                      <h3 className="text-xl font-bold text-white">{winner.prize_name}</h3>
                    </div>
                    <div className="mt-2 md:mt-0 text-right">
                      <div className="text-sm text-gray-400 mb-1">
                        <Calendar className="inline-block w-4 h-4 mr-1" />
                        {new Date(winner.created_at).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-neon-cyan font-medium">
                        <Tag className="inline-block w-4 h-4 mr-1" />
                        {formatCurrency(winner.prize_value)}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4">
                    {winner.raffle.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <div className="bg-galaxy-deepPurple/40 rounded-full px-3 py-1 flex items-center">
                      <Gift className="w-4 h-4 mr-1 text-neon-pink" />
                      <span>Número sorteado: <strong>{winner.winning_number}</strong></span>
                    </div>
                    <div className="bg-galaxy-deepPurple/40 rounded-full px-3 py-1 flex items-center">
                      <Award className="w-4 h-4 mr-1 text-neon-cyan" />
                      <span>Tipo: <strong>{winner.raffle.prize_type}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

export default RaffleWinnersList; 