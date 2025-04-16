
export interface ParticipationState {
  userTickets: number;
  userPoints: number;
  participationCount: number;
  isParticipating: boolean;
  purchaseAmount: number;
  purchaseMode: 'tickets' | 'points';
  remainingSlots: number;
}

export interface ParticipationHandlers {
  handleDecreasePurchase: () => void;
  handleIncreasePurchase: () => void;
  handlePurchase: () => void;
  setPurchaseMode: (mode: 'tickets' | 'points') => void;
}

export interface ParticipationConfig {
  maxTicketsPerUser: number;
  ticketsRequired: number;
  isParticipationClosed?: boolean;
}

export interface ParticipationCalculations {
  pointsNeeded: number;
  canPurchaseWithTickets: boolean;
  canPurchaseWithPoints: boolean;
  discountPercentage: number;
  currentLevelName: string;
}

export interface ParticipationResult extends 
  ParticipationState, 
  ParticipationHandlers,
  ParticipationCalculations {
  isParticipationClosed: boolean;
}
