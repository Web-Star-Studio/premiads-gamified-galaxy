
import { useState, useEffect, useRef } from 'react';
import { useSounds } from "@/hooks/use-sounds";
import { calculateCountdownInfo } from './utils/countdownUtils';
import { fetchRaffleById } from './api/fetchRaffleData';
import { Raffle, RaffleDataResult } from './types/raffleTypes';

export const useRaffleData = (raffleId: number | null): RaffleDataResult => {
  const { playSound } = useSounds();
  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [countdownInfo, setCountdownInfo] = useState({
    isCountingDown: false,
    timeRemaining: '',
    isLastHour: false,
    isParticipationClosed: false
  });
  
  // Use refs to prevent stale closure issues
  const raffleIdRef = useRef(raffleId);
  
  useEffect(() => {
    // Update the ref whenever raffleId changes
    raffleIdRef.current = raffleId;
    
    const loadRaffleData = async () => {
      setIsLoading(true);
      
      if (!raffleId) {
        setRaffle(null);
        setIsLoading(false);
        return;
      }
      
      try {
        const foundRaffle = await fetchRaffleById(raffleId);
        
        if (foundRaffle) {
          // Calculate countdown information
          const updatedCountdownInfo = calculateCountdownInfo(
            foundRaffle.minPointsReachedAt, 
            foundRaffle.drawDate
          );
          
          setRaffle(foundRaffle);
          setCountdownInfo(updatedCountdownInfo);
        }
        
        // Set loading to false regardless of whether a raffle was found
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading raffle:", error);
        setIsLoading(false);
      }
    };
    
    loadRaffleData();
    
    // Set up interval to update countdown information every minute
    const intervalId = setInterval(() => {
      // Use the ref value to avoid stale closures
      const currentRaffleId = raffleIdRef.current;
      
      if (currentRaffleId && raffle?.minPointsReachedAt) {
        const updatedCountdownInfo = calculateCountdownInfo(
          raffle.minPointsReachedAt,
          raffle.drawDate
        );
        setCountdownInfo(updatedCountdownInfo);
      }
    }, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, [raffleId, raffle]);
  
  return { 
    raffle, 
    isLoading,
    countdownInfo
  };
};
