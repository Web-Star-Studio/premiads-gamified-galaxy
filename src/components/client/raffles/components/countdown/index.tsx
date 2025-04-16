
import RegularBadge from './RegularBadge';
import LastHourBadge from './LastHourBadge';
import ClosedBadge from './ClosedBadge';
import { CountdownBadgeProps } from './types';

export const CountdownBadge = ({ timeRemaining, isLastHour, isParticipationClosed }: CountdownBadgeProps) => {
  if (isParticipationClosed) {
    return <ClosedBadge timeRemaining={timeRemaining} />;
  }
  
  if (isLastHour) {
    return <LastHourBadge timeRemaining={timeRemaining} />;
  }
  
  return <RegularBadge timeRemaining={timeRemaining} />;
};

export { RegularBadge, LastHourBadge, ClosedBadge };
