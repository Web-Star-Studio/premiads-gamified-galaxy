
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Info, Ticket, Users } from "lucide-react";

interface RaffleInfoCardProps {
  startDate: string;
  endDate: string;
  drawDate: string;
  totalParticipants: number;
  ticketsRequired: number;
  maxTicketsPerUser: number;
}

const RaffleInfoCard = ({
  startDate,
  endDate,
  drawDate,
  totalParticipants,
  ticketsRequired,
  maxTicketsPerUser
}: RaffleInfoCardProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

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
            {formatDate(startDate)}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">Encerramento</div>
          <div className="flex items-center text-sm">
            <Calendar className="w-3 h-3 mr-1 text-neon-pink" />
            {formatDate(endDate)}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">Sorteio</div>
          <div className="flex items-center text-sm">
            <Clock className="w-3 h-3 mr-1 text-neon-lime" />
            {formatDate(drawDate)}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">Participantes</div>
          <div className="flex items-center text-sm">
            <Users className="w-3 h-3 mr-1" />
            {totalParticipants}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">Custo</div>
          <div className="flex items-center text-sm">
            <Ticket className="w-3 h-3 mr-1 text-neon-cyan" />
            {ticketsRequired} {ticketsRequired > 1 ? "tickets" : "ticket"} por participação
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">Limite por usuário</div>
          <div className="text-sm">{maxTicketsPerUser} participações</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RaffleInfoCard;
