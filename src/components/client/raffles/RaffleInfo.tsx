
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Info, Users, Ticket } from "lucide-react";
import { formatDate } from "./raffleData";
import type { Raffle } from "./raffleData";

interface RaffleInfoProps {
  raffle: Raffle;
}

const RaffleInfo = ({ raffle }: RaffleInfoProps) => {
  return (
    <Card className="bg-galaxy-deepPurple/30 border-galaxy-purple/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Info className="w-4 h-4 text-neon-cyan" />
          Informações
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">Início</div>
          <div className="flex items-center text-sm">
            <Calendar className="w-3 h-3 mr-1 text-neon-cyan" />
            {formatDate(raffle.startDate)}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">Encerramento</div>
          <div className="flex items-center text-sm">
            <Calendar className="w-3 h-3 mr-1 text-neon-pink" />
            {formatDate(raffle.endDate)}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">Sorteio</div>
          <div className="flex items-center text-sm">
            <Clock className="w-3 h-3 mr-1 text-neon-lime" />
            {formatDate(raffle.drawDate)}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">Participantes</div>
          <div className="flex items-center text-sm">
            <Users className="w-3 h-3 mr-1" />
            {raffle.totalParticipants}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">Custo</div>
          <div className="flex items-center text-sm">
            <Ticket className="w-3 h-3 mr-1 text-neon-cyan" />
            {raffle.ticketsRequired} {raffle.ticketsRequired > 1 ? "tickets" : "ticket"} por participação
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">Limite por usuário</div>
          <div className="text-sm">{raffle.maxTicketsPerUser} participações</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RaffleInfo;
