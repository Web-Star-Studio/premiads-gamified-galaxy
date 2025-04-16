
import { Raffle, RafflePrize } from '../types/raffleTypes';
import { RAFFLES } from '../data/mockRaffles';

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
