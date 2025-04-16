
import React from 'react';
import { CountdownBadgeProps } from './types';
import ClosedBadge from './ClosedBadge';
import LastHourBadge from './LastHourBadge';
import RegularBadge from './RegularBadge';

const CountdownBadge = ({ 
  timeRemaining, 
  isLastHour,
  isParticipationClosed 
}: CountdownBadgeProps) => {
  if (isParticipationClosed) {
    return <ClosedBadge timeRemaining={timeRemaining} />;
  }
  
  if (isLastHour) {
    return <LastHourBadge timeRemaining={timeRemaining} />;
  }
  
  return <RegularBadge timeRemaining={timeRemaining} />;
};

export default CountdownBadge;
