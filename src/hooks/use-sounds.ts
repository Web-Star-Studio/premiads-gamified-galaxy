
import { useCallback, useRef } from "react";

export type SoundType = "pop" | "chime" | "success" | "error" | "notification" | "reward";

interface SoundOptions {
  volume?: number; // 0 to 1
}

export const useSounds = () => {
  const audioCache = useRef<Record<string, HTMLAudioElement>>({});
  
  const soundMap: Record<SoundType, string> = {
    pop: "/sounds/pop.mp3",
    chime: "/sounds/chime.mp3",
    success: "/sounds/success.mp3",
    error: "/sounds/error.mp3",
    notification: "/sounds/notification.mp3",
    reward: "/sounds/reward.mp3",
  };

  const playSound = useCallback(
    (sound: SoundType, options?: SoundOptions) => {
      try {
        // Check if audio context is allowed
        if (typeof window === "undefined") return;
        
        const volume = options?.volume ?? 0.5;
        
        // Use cached audio element or create a new one
        if (!audioCache.current[sound]) {
          audioCache.current[sound] = new Audio(soundMap[sound]);
        }
        
        const audio = audioCache.current[sound];
        
        // Set volume and play
        audio.volume = volume;
        
        // Reset audio to beginning if it's already playing
        audio.currentTime = 0;
        
        // Use promise with catch to handle play errors silently
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            // Silent error handling - browsers often block autoplay
            console.log("Sound playback was prevented by the browser", sound);
          });
        }
      } catch (error) {
        // Silently handle errors to prevent app disruption
        console.log("Sound system unavailable", error);
      }
    },
    [soundMap]
  );

  return { playSound };
};
