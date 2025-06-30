
import { Raffle, RafflePrize } from '../types/raffleTypes';
import { RAFFLES } from '../data/mockRaffles';
import { RaffleService } from '../data/mockRaffles';
import { Lottery } from '@/types/lottery';

/**
 * Fetches a raffle by its ID from the mock data
 * In a real app, this would be an API call
 */
export const fetchRaffleById = async (raffleId: number): Promise<Raffle | null> => {
  if (!raffleId) return null;
  
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In a real app, this would be an API fetch
    const foundRaffle = RAFFLES.find(r => r.id === raffleId);
    
    if (foundRaffle) {
      // Cast the status string to ensure it matches the expected union type
      const typedRaffle: Raffle = {
        ...foundRaffle,
        status: foundRaffle.status as "active" | "draft" | "finished" | "canceled",
        prizes: foundRaffle.prizes.map(prize => ({
          ...prize,
          rarity: prize.rarity as "common" | "uncommon" | "rare" | "legendary"
        }))
      };
      
      console.log("Fetched raffle data:", typedRaffle);
      return typedRaffle;
    }
    
    console.log("No raffle found with ID:", raffleId);
    return null;
  } catch (error) {
    console.error("Error fetching raffle:", error);
    return null;
  }
};

/**
 * Fetches a raffle by ID using the raffle service
 */
export const fetchRaffleByIdUsingService = async (raffleId: number | string): Promise<Lottery | null> => {
  try {
    const { data } = await RaffleService.getRaffleById(String(raffleId));
    return data;
  } catch (error) {
    console.error("Error fetching raffle:", error);
    return null;
  }
};

/**
 * Fetches all active raffles
 */
export const fetchActiveRaffles = async (): Promise<Lottery[]> => {
  try {
    const { data } = await RaffleService.getActiveRaffles();
    return data || [];
  } catch (error) {
    console.error("Error fetching active raffles:", error);
    return [];
  }
};
