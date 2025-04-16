
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface RaffleImageProps {
  imageUrl: string;
  name: string;
  ticketsRequired: number;
}

const RaffleImage = ({ imageUrl, name, ticketsRequired }: RaffleImageProps) => {
  return (
    <div className="relative h-56 rounded-lg overflow-hidden mb-4">
      <img 
        src={imageUrl} 
        alt={name}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-galaxy-deepPurple/90 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-heading text-white">{name}</h2>
          <Badge className="bg-galaxy-deepPurple text-neon-cyan border border-neon-cyan/30">
            {ticketsRequired} {ticketsRequired > 1 ? "tickets" : "ticket"}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default RaffleImage;
