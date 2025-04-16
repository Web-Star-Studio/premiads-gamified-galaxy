
import React from 'react';
import { ParticipationCard as RefactoredCard } from './participation';
import { ParticipationCardProps } from './participation/types';

const ParticipationCard = (props: ParticipationCardProps) => {
  return <RefactoredCard {...props} />;
};

export default ParticipationCard;
