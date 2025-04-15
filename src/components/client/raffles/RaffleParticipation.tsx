
import { AlertTriangle } from "lucide-react";

interface RaffleParticipationProps {
  participationCount: number;
  remainingSlots: number;
}

const RaffleParticipation = ({ participationCount, remainingSlots }: RaffleParticipationProps) => {
  return (
    <div className="bg-galaxy-deepPurple/40 rounded-lg p-4 border border-galaxy-purple/20 mb-6">
      <div className="flex items-start">
        <AlertTriangle className="w-5 h-5 text-neon-cyan mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h4 className="font-medium mb-1">Sua participação</h4>
          <p className="text-sm text-gray-400">
            {participationCount > 0 ? (
              <>Você está participando com <span className="text-neon-cyan">{participationCount} ticket(s)</span> neste sorteio.</>
            ) : (
              <>Você ainda não está participando deste sorteio.</>
            )}
            {remainingSlots > 0 && (
              <> Você ainda pode adicionar <span className="text-neon-lime">{remainingSlots} ticket(s)</span> adicionais.</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RaffleParticipation;
