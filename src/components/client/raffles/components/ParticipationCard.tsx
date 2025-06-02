
import React from 'react';
import { ParticipationCard as RefactoredCard } from './participation';
import { ParticipationCardProps } from './participation/types';

const ParticipationCard = (props: ParticipationCardProps) => <RefactoredCard {...props} />;

export default ParticipationCard;
