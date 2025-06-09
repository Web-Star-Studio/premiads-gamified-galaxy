import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Ticket } from 'lucide-react';

interface ParticipationPanelProps {
  availableTickets: number;
  ticketAmount: number;
  pointsPerNumber: number;
  increaseTickets: () => void;
  decreaseTickets: () => void;
  onParticipate: () => void;
  isLoading: boolean;
}

export const ParticipationPanel: React.FC<ParticipationPanelProps> = ({
  availableTickets,
  ticketAmount,
  pointsPerNumber,
  increaseTickets,
  decreaseTickets,
  onParticipate,
  isLoading
}) => {
  return (
    <div className="bg-black/30 border border-white/10 rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">Participar deste Sorteio</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <p className="text-gray-400 mb-2">Você possui <span className="font-bold text-neon-cyan">{availableTickets}</span> tickets disponíveis</p>
            <p className="text-sm text-gray-500">Cada número custa {pointsPerNumber} pontos</p>
          </div>
          
          <div className="flex items-center mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={decreaseTickets}
              disabled={ticketAmount <= 1 || isLoading}
              className="bg-galaxy-dark/50 border-galaxy-purple/30 hover:bg-galaxy-purple/20"
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <div className="mx-4 px-6 py-2 bg-galaxy-deepPurple border border-galaxy-purple/30 rounded-md min-w-[80px] text-center">
              <span className="font-bold text-lg">{ticketAmount}</span>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={increaseTickets}
              disabled={ticketAmount >= availableTickets || isLoading}
              className="bg-galaxy-dark/50 border-galaxy-purple/30 hover:bg-galaxy-purple/20"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-1">Resumo:</h4>
            <ul className="space-y-1 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-400">Números:</span>
                <span className="font-bold">{ticketAmount}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Custo total:</span>
                <span className="font-bold">{ticketAmount * pointsPerNumber} pontos</span>
              </li>
            </ul>
          </div>
          
          <Button
            onClick={onParticipate}
            disabled={isLoading || ticketAmount === 0 || availableTickets === 0}
            className="w-full mt-4 bg-gradient-to-r from-neon-cyan to-neon-pink hover:opacity-90 font-bold"
          >
            <Ticket className="mr-2 h-4 w-4" />
            {isLoading ? "Processando..." : "Participar Agora"}
          </Button>
        </div>
      </div>
    </div>
  );
}; 