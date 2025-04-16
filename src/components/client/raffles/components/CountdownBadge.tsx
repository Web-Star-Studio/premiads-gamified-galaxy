
import React from 'react';
import { CountdownBadge as RefactoredCountdownBadge } from './countdown';

// Define the props interface here to avoid circular dependencies
export interface CountdownBadgeProps {
  timeRemaining: string;
  isLastHour: boolean;
  isParticipationClosed: boolean;
}

const CountdownBadge = (props: CountdownBadgeProps) => {
  return <RefactoredCountdownBadge {...props} />;
};

export default CountdownBadge;
