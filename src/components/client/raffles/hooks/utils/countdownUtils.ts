
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface CountdownInfo {
  isCountingDown: boolean;
  timeRemaining: string;
  isLastHour: boolean;
  isParticipationClosed: boolean;
}

/**
 * Calculates countdown information based on minPointsReachedAt and drawDate
 */
export const calculateCountdownInfo = (minPointsReachedAt: string | null, drawDate: string | null): CountdownInfo => {
  if (!minPointsReachedAt || !drawDate) {
    return {
      isCountingDown: false,
      timeRemaining: '',
      isLastHour: false,
      isParticipationClosed: false
    };
  }
  
  const now = new Date();
  const drawDateTime = new Date(drawDate);
  const minPointsReachedAtTime = new Date(minPointsReachedAt);
  
  // Check if we're in countdown mode (within 48 hours after min points reached)
  const isCountingDown = minPointsReachedAtTime <= now && now <= drawDateTime;
  
  // Calculate time remaining until draw
  let timeRemaining = '';
  try {
    timeRemaining = formatDistanceToNow(drawDateTime, { addSuffix: true, locale: ptBR });
  } catch (error) {
    console.error("Error formatting time:", error);
    timeRemaining = "em breve";
  }
  
  // Check if we're in the last hour
  const oneHourBeforeDraw = new Date(drawDateTime);
  oneHourBeforeDraw.setHours(oneHourBeforeDraw.getHours() - 1);
  const isLastHour = now >= oneHourBeforeDraw && now <= drawDateTime;
  
  // Check if participation is closed (less than 1 hour before draw)
  const isParticipationClosed = now >= oneHourBeforeDraw;
  
  return {
    isCountingDown,
    timeRemaining,
    isLastHour,
    isParticipationClosed
  };
};
