
import { useCallback } from "react";

type SoundType = "success" | "error" | "notification" | "click" | "reward";

export const useSounds = () => {
  const playSound = useCallback((type: SoundType) => {
    let soundUrl: string;
    
    switch (type) {
      case "success":
        soundUrl = "/sounds/success.mp3";
        break;
      case "error":
        soundUrl = "/sounds/error.mp3";
        break;
      case "notification":
        soundUrl = "/sounds/notification.mp3";
        break;
      case "click":
        soundUrl = "/sounds/click.mp3";
        break;
      case "reward":
        soundUrl = "/sounds/reward.mp3";
        break;
      default:
        soundUrl = "/sounds/click.mp3";
    }
    
    try {
      const audio = new Audio(soundUrl);
      audio.volume = 0.5; // Set volume to 50%
      audio.play().catch((error) => {
        // Silently handle error - browsers often block autoplay
        console.log("Sound not played:", error);
      });
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }, []);
  
  return { playSound };
};
