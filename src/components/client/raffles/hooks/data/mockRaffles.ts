import raffleService from '@/services/raffles';

// This is a placeholder file that will be replaced with real data from the raffle service
// For now, we're setting an empty array but in a real implementation, 
// this would be fetched from the service
export const RAFFLES = [];

// Export the service for direct use
export { raffleService };

// Helper function to fetch active raffles
export async function fetchActiveRaffles() {
  try {
    return await raffleService.getActiveRaffles();
  } catch (error) {
    console.error("Error fetching active raffles:", error);
    return [];
  }
}

