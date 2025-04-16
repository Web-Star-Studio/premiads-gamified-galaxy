
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches user data from Supabase including points and profile information
 */
export const fetchUserData = async () => {
  try {
    console.log("Fetching user data...");
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      console.log("No authenticated user found, using default values");
      return { points: 0, tickets: 0 };
    }
    
    const { data: profileData } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', session.user.id)
      .single();
      
    console.log("User data fetched", { 
      points: profileData?.points || 0, 
      tickets: 8 // Mock data
    });
    
    // In a real app, we would also fetch tickets information
    // For now, we're using mock data
    
    return {
      points: profileData?.points || 0,
      tickets: 8 // Mock data
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { points: 0, tickets: 0 };
  }
};

/**
 * Simulates participation in a raffle
 * In a real app, this would be an API call
 */
export const participateInRaffle = async (
  raffleId: number, 
  purchaseAmount: number, 
  purchaseMode: 'tickets' | 'points',
  pointsToDeduct: number
) => {
  console.log("Participating in raffle", { 
    raffleId, 
    purchaseAmount, 
    purchaseMode, 
    pointsToDeduct 
  });
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real app, this would be a call to the API to record the participation
  const result = {
    success: true,
    newParticipationCount: 0, // This would come from the API
    deductedPoints: purchaseMode === 'points' ? pointsToDeduct : 0,
    deductedTickets: purchaseMode === 'tickets' ? purchaseAmount : 0
  };
  
  console.log("Participation result:", result);
  return result;
};
