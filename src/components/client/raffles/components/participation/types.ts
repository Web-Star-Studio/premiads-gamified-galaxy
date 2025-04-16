
export interface ParticipationCardProps {
  ticketsRequired: number;
  maxTicketsPerUser: number;
  participationCount: number;
  userTickets: number;
  userPoints: number;
  isParticipating: boolean;
  onPurchase: () => void;
  purchaseMode: 'tickets' | 'points';
  setPurchaseMode: (mode: 'tickets' | 'points') => void;
  purchaseAmount: number;
  handleDecreasePurchase: () => void;
  handleIncreasePurchase: () => void;
  canPurchaseWithTickets: boolean;
  canPurchaseWithPoints: boolean;
  pointsNeeded: number;
  discountPercentage?: number;
  currentLevelName?: string;
  isParticipationClosed?: boolean;
}
