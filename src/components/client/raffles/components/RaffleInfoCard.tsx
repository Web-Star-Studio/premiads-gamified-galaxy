
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Ticket, AlarmClock, Timer, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RaffleInfoCardProps {
  startDate: string;
  endDate: string | null;
  drawDate: string | null;
  totalParticipants: number;
  ticketsRequired: number;
  maxTicketsPerUser: number;
  minPoints?: number;
  isAutoScheduled?: boolean;
  minPointsReachedAt?: string | null;
}

const RaffleInfoCard = ({ 
  startDate, 
  endDate, 
  drawDate, 
  totalParticipants, 
  ticketsRequired,
  maxTicketsPerUser,
  minPoints = 0,
  isAutoScheduled = false,
  minPointsReachedAt = null
}: RaffleInfoCardProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "A definir";
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };
  
  const getDrawDateInfo = () => {
    if (!isAutoScheduled) {
      return formatDate(drawDate);
    }
    
    if (minPointsReachedAt) {
      return formatDate(drawDate);
    }
    
    return "Automático (48h após atingir meta)";
  };
  
  const getDrawModeText = () => {
    if (!isAutoScheduled) {
      return "Data fixa";
    }
    
    if (minPointsReachedAt) {
      try {
        return `Meta atingida ${formatDistanceToNow(new Date(minPointsReachedAt), { 
          addSuffix: true, 
          locale: ptBR 
        })}`;
      } catch (e) {
        return "Meta atingida";
      }
    }
    
    return `Meta: ${minPoints} tickets`;
  };

  return (
    <Card className="bg-galaxy-deepPurple/30 border-galaxy-purple/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Calendar className="w-4 h-4 text-neon-cyan mr-2" />
          Informações do Sorteio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-400 mb-1 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span>Início</span>
            </div>
            <div className="text-sm">{formatDate(startDate)}</div>
          </div>
          
          <div>
            <div className="text-sm text-gray-400 mb-1 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span>Término</span>
            </div>
            <div className="text-sm">{formatDate(endDate)}</div>
          </div>
        </div>
        
        <div>
          <div className="text-sm text-gray-400 mb-1 flex items-center">
            <Timer className="w-3 h-3 mr-1" />
            <span>Data do Sorteio</span>
            
            {isAutoScheduled && (
              <Badge className="ml-2 bg-neon-cyan/20 text-neon-cyan text-xs">
                Automático
              </Badge>
            )}
          </div>
          <div className="text-sm">{getDrawDateInfo()}</div>
          <div className="text-xs text-gray-500 mt-1">{getDrawModeText()}</div>
        </div>
        
        <div className="pt-2 border-t border-galaxy-purple/20">
          <div className="text-sm text-gray-400 mb-2 flex items-center">
            <Users className="w-3 h-3 mr-1" />
            <span>Participantes</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Total de participantes:</span>
            <span className="text-sm font-medium">{totalParticipants}</span>
          </div>
          
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm">Tickets por participação:</span>
            <span className="text-sm font-medium">{ticketsRequired}</span>
          </div>
          
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm">Máximo por usuário:</span>
            <span className="text-sm font-medium">{maxTicketsPerUser}</span>
          </div>
        </div>
        
        {isAutoScheduled && (
          <div className="pt-2 border-t border-galaxy-purple/20">
            <div className="text-sm text-gray-400 mb-2 flex items-center">
              <AlarmClock className="w-3 h-3 mr-1" />
              <span>Sistema Automático</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Meta de tickets:</span>
              <span className="text-sm font-medium">{minPoints.toLocaleString('pt-BR')}</span>
            </div>
            
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm">Janela de participação:</span>
              <span className="text-sm font-medium">Até 1h antes do sorteio</span>
            </div>
            
            {minPointsReachedAt && (
              <div className="mt-3 bg-neon-cyan/10 p-2 rounded-md border border-neon-cyan/20">
                <div className="flex items-center gap-1 text-xs">
                  <AlertCircle className="w-3 h-3 text-neon-cyan" />
                  <span className="text-neon-cyan">Meta de tickets atingida</span>
                </div>
                <div className="text-xs mt-1">
                  Sorteio será realizado {formatDate(drawDate)}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RaffleInfoCard;
