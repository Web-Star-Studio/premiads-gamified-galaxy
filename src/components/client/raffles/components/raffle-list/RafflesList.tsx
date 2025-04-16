
import React from "react";
import RaffleListItem from "./RaffleListItem";
import EmptyState from "./EmptyState";

interface RafflesListProps {
  raffles: any[];
  selectedRaffleId: number | null;
  onSelectRaffle: (id: number) => void;
  formatTimeRemaining: (date: string) => string;
  getRarityColor: (rarity: string) => string;
}

const RafflesList = ({ 
  raffles, 
  selectedRaffleId, 
  onSelectRaffle,
  formatTimeRemaining,
  getRarityColor
}: RafflesListProps) => {
  if (raffles.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {raffles.map((raffle) => (
        <RaffleListItem
          key={raffle.id}
          raffle={raffle}
          isSelected={selectedRaffleId === raffle.id}
          onSelect={() => onSelectRaffle(raffle.id)}
          formatTimeRemaining={formatTimeRemaining}
          getRarityColor={getRarityColor}
        />
      ))}
    </div>
  );
};

export default RafflesList;
