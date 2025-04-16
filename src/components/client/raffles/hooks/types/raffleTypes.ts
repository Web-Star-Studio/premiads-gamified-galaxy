
export interface RafflePrize {
  id: number;
  name: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  probability: number;
  image: string;
}

export interface Raffle {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  drawDate: string;
  ticketsRequired: number;
  status: 'active' | 'draft' | 'finished' | 'canceled';
  maxTicketsPerUser: number;
  totalParticipants: number;
  totalTickets: number;
  soldTickets: number;
  progress: number;
  minPointsReachedAt: string | null;
  isAutoScheduled: boolean;
  minPoints: number;
  imageUrl: string;
  prizes: RafflePrize[];
}

export interface RaffleDataResult {
  raffle: Raffle | null;
  isLoading: boolean;
  countdownInfo: {
    isCountingDown: boolean;
    timeRemaining: string;
    isLastHour: boolean;
    isParticipationClosed: boolean;
  };
}
