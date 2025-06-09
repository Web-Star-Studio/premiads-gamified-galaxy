import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Clock, Gift, Award, Ticket, Users, ArrowRight } from "lucide-react";
import { CountdownDisplay } from "../countdown/CountdownDisplay";
import { ParticipationPanel } from "../participation/ParticipationPanel";
import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";
import { Lottery } from "@/types/lottery";
import { CountdownInfo } from "../../hooks/useRaffleData";
import { formatCurrency } from "@/utils/formatters";

interface RaffleDetailsContentProps {
  raffle: Lottery;
  countdownInfo: CountdownInfo | null;
  userNumbers?: number[];
  availableTickets?: number;
  participationLoading?: boolean;
  participateInRaffle?: (numberOfTickets: number) => Promise<void>;
}

const RaffleDetailsContent: React.FC<RaffleDetailsContentProps> = ({
  raffle,
  countdownInfo,
  userNumbers = [],
  availableTickets = 0,
  participationLoading = false,
  participateInRaffle
}) => {
  const [ticketAmount, setTicketAmount] = useState(1);
  const { playSound } = useSounds();
  const { toast } = useToast();
  
  const increaseTickets = () => {
    if (ticketAmount < availableTickets) {
      setTicketAmount(prev => prev + 1);
      playSound("pop");
    } else {
      toast({
        title: "Limite atingido",
        description: "Você não possui mais tickets disponíveis.",
        variant: "destructive",
      });
    }
  };
  
  const decreaseTickets = () => {
    if (ticketAmount > 1) {
      setTicketAmount(prev => prev - 1);
      playSound("pop");
    }
  };
  
  const handleParticipate = async () => {
    if (participateInRaffle) {
      await participateInRaffle(ticketAmount);
    }
  };
  
  const isActive = raffle.status === 'active';
  const isClosed = ['completed', 'canceled'].includes(raffle.status);

  return (
    <div className="glass-panel p-6 h-full">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold font-heading mb-2">{raffle.name}</h2>
            <p className="text-gray-400 max-w-xl">{raffle.description}</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-lg font-bold text-neon-cyan">
              {formatCurrency(raffle.prizeValue)}
            </div>
            <div className="text-sm text-gray-400">{raffle.prizeType}</div>
          </div>
        </div>
        
        {/* Raffle image and countdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <div className="relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-black/20">
              {raffle.imageUrl ? (
                <img
                  src={raffle.imageUrl}
                  alt={raffle.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Gift className="w-16 h-16 text-gray-500" />
                </div>
              )}
              
              {raffle.status === 'completed' && raffle.winner && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                  <Award className="w-12 h-12 text-neon-pink mb-2" />
                  <h3 className="text-xl font-bold text-white">Sorteio Finalizado</h3>
                  <p className="text-neon-cyan mt-1">
                    Número sorteado: <span className="font-bold">{raffle.winning_number}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="bg-black/20 border border-white/10 rounded-lg p-4 h-full flex flex-col">
              <div className="flex items-center mb-4">
                <Clock className="w-5 h-5 text-neon-pink mr-2" />
                <h3 className="text-lg font-bold">Tempo Restante</h3>
              </div>
              
              {countdownInfo ? (
                <CountdownDisplay countdownInfo={countdownInfo} />
              ) : (
                <div className="text-gray-400 text-center py-4">
                  Carregando contagem regressiva...
                </div>
              )}
              
              <div className="mt-auto text-sm text-gray-400">
                {isClosed ? (
                  <div className="text-neon-pink">Sorteio encerrado</div>
                ) : (
                  <>
                    Início: {new Date(raffle.startDate).toLocaleDateString()}<br />
                    Término: {new Date(raffle.endDate).toLocaleDateString()}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Detailed description */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Detalhes do Sorteio</h3>
          <div className="bg-black/20 border border-white/10 rounded-lg p-4">
            <p className="text-gray-300">{raffle.detailedDescription}</p>
          </div>
        </div>
        
        {/* Progress and participation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-bold mb-2">Status do Sorteio</h3>
            <div className="bg-black/20 border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Progresso</span>
                <span className="font-bold text-neon-cyan">{raffle.progress}%</span>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-gradient-to-r from-neon-cyan to-neon-pink h-2.5 rounded-full" 
                  style={{ width: `${raffle.progress}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">
                  <Users className="w-4 h-4 inline mr-1" />
                  {raffle.numbersSold} / {raffle.numbersTotal} números
                </span>
                
                <span className={`font-bold ${isActive ? 'text-green-500' : isClosed ? 'text-red-500' : 'text-yellow-500'}`}>
                  {isActive ? 'Ativo' : isClosed ? 'Encerrado' : 'Pendente'}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-2">Seus Números</h3>
            <div className="bg-black/20 border border-white/10 rounded-lg p-4 h-full">
              {userNumbers.length > 0 ? (
                <div>
                  <p className="text-gray-300 mb-2">
                    Você possui <span className="font-bold text-neon-cyan">{userNumbers.length}</span> números neste sorteio:
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userNumbers.map(number => (
                      <div 
                        key={number} 
                        className="bg-galaxy-purple/20 border border-galaxy-purple/30 rounded px-2 py-1 text-sm font-mono"
                      >
                        {number}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 flex flex-col items-center justify-center h-full">
                  <Ticket className="w-8 h-8 mb-2 text-gray-500" />
                  <p>Você ainda não possui números neste sorteio.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Participation panel */}
        {isActive && (
          <div className="mt-auto">
            <ParticipationPanel
              availableTickets={availableTickets}
              ticketAmount={ticketAmount}
              increaseTickets={increaseTickets}
              decreaseTickets={decreaseTickets}
              onParticipate={handleParticipate}
              isLoading={participationLoading}
              pointsPerNumber={raffle.pointsPerNumber}
            />
          </div>
        )}
        
        {!isActive && (
          <div className="mt-auto text-center py-4">
            {isClosed ? (
              <div className="bg-gray-800/50 rounded-lg p-4 border border-white/10">
                <Award className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <h3 className="text-lg font-bold mb-1">Sorteio Finalizado</h3>
                <p className="text-gray-400">Este sorteio já foi encerrado.</p>
                {raffle.winner && (
                  <p className="text-neon-cyan mt-2">
                    Número sorteado: <span className="font-bold">{raffle.winning_number}</span>
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-gray-800/50 rounded-lg p-4 border border-white/10">
                <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <h3 className="text-lg font-bold mb-1">Sorteio em Preparação</h3>
                <p className="text-gray-400">Este sorteio ainda não está disponível para participação.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RaffleDetailsContent;
