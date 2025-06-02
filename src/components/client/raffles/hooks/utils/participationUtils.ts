
import { useUserLevel } from "@/hooks/useUserLevel";

export const POINTS_PER_TICKET = 100;

/**
 * Calculates the points needed based on the user's level discount
 */
export const calculatePointsNeeded = (
  purchaseAmount: number,
  ticketsRequired: number, 
  discountPercentage: number
): number => {
  const discount = discountPercentage / 100;
  const basePointsNeeded = purchaseAmount * ticketsRequired * POINTS_PER_TICKET;
  return Math.round(basePointsNeeded * (1 - discount));
};

/**
 * Determines if the user can purchase with tickets
 */
export const canPurchaseWithTickets = (
  userTickets: number,
  purchaseAmount: number,
  participationCount: number,
  maxTicketsPerUser: number,
  isParticipationClosed: boolean
): boolean => (
    userTickets >= purchaseAmount && 
    participationCount + purchaseAmount <= maxTicketsPerUser &&
    !isParticipationClosed
  );

/**
 * Determines if the user can purchase with points
 */
export const canPurchaseWithPoints = (
  userPoints: number,
  pointsNeeded: number,
  participationCount: number,
  purchaseAmount: number,
  maxTicketsPerUser: number,
  isParticipationClosed: boolean
): boolean => (
    userPoints >= pointsNeeded && 
    participationCount + purchaseAmount <= maxTicketsPerUser &&
    !isParticipationClosed
  );

/**
 * Gets the discount percentage from the user's level
 */
export const getDiscountPercentage = (levelInfo: any): number => {
  if (!levelInfo) return 0;
  return levelInfo.currentLevel.benefits.ticket_discount;
};
