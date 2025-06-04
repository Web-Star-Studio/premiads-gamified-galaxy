import { useCallback } from "react";

type SoundType = "success" | "error" | "notification" | "click" | "reward" | "pop" | "chime";

export const useSounds = () => {
  const playSound = useCallback((type: SoundType) => {
    // Disable sounds in development automatically due to corrupted placeholder files
    if (import.meta.env.DEV) {
      return;
    }

    const soundUrl = `/sounds/${type}.mp3`;
    
    try {
      const audio = new Audio(soundUrl);
      audio.volume = 0.3; // Lower volume to be less intrusive
      
      // Add error handling for corrupted files
      audio.addEventListener('error', (e) => {
        console.error(`Error loading sound ${soundUrl}:`, e);
      });
      
      audio.play().catch((error) => {
        console.log("Sound not played:", error.message);
      });
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }, []);
  
  return { playSound };
};
