
import { useRef, useCallback, useEffect } from "react";

// Sound URLs - would typically be imported from actual audio files
const SOUND_URLS = {
  chime: "https://assets.mixkit.co/active_storage/sfx/2019/chime-notification-alert.wav",
  pop: "https://assets.mixkit.co/active_storage/sfx/2044/game-pop-alert.wav",
  reward: "https://assets.mixkit.co/active_storage/sfx/2020/coin-win-notification.wav",
  error: "https://assets.mixkit.co/active_storage/sfx/2021/error-negative-alert.wav",
};

type SoundName = keyof typeof SOUND_URLS;

export function useSounds() {
  const audioCache = useRef<Record<SoundName, HTMLAudioElement>>({} as Record<SoundName, HTMLAudioElement>);

  // Preload sounds
  useEffect(() => {
    const soundsToLoad = Object.entries(SOUND_URLS) as [SoundName, string][];
    
    soundsToLoad.forEach(([name, url]) => {
      const audio = new Audio(url);
      audio.preload = "auto";
      audioCache.current[name] = audio;
    });
    
    return () => {
      Object.values(audioCache.current).forEach(audio => {
        audio.pause();
        audio.src = "";
      });
    };
  }, []);

  const playSound = useCallback((name: SoundName) => {
    const audio = audioCache.current[name];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(err => console.error("Failed to play sound:", err));
    }
  }, []);

  return { playSound };
}
