
import React from 'react';
import { RaffleImage, RaffleDescription, RaffleProgress } from './header';

interface RaffleHeaderProps {
  name: string;
  imageUrl: string;
  description: string;
  ticketsRequired: number;
  progress: number;
  soldTickets: number;
  totalTickets: number;
}

const RaffleHeader = ({ 
  name, 
  imageUrl, 
  description, 
  ticketsRequired, 
  progress, 
  soldTickets, 
  totalTickets 
}: RaffleHeaderProps) => (
    <div className="mb-6">
      <RaffleImage 
        imageUrl={imageUrl} 
        name={name} 
        ticketsRequired={ticketsRequired} 
      />
      
      <RaffleDescription description={description} />
      
      <RaffleProgress 
        progress={progress} 
        soldTickets={soldTickets} 
        totalTickets={totalTickets} 
      />
    </div>
  );

export default RaffleHeader;
