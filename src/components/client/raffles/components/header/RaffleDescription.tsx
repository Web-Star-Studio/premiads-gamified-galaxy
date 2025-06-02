
import React from 'react';

interface RaffleDescriptionProps {
  description: string;
}

const RaffleDescription = ({ description }: RaffleDescriptionProps) => <p className="text-gray-400 mb-4">{description}</p>;

export default RaffleDescription;
