
import { useCallback } from 'react';

type SoundType = 'pop' | 'success' | 'error' | 'notification' | 'reward' | 'chime' | 'click';

export const useSounds = () => {
  const playSound = useCallback((soundType: SoundType) => {
    try {
      const audio = new Audio(`/sounds/${soundType}.mp3`);
      
      // Adicionar tratamento de erro silencioso
      audio.addEventListener('error', () => {
        // Falha silenciosa - não loggar erro no console
      });
      
      audio.addEventListener('canplaythrough', () => {
        audio.play().catch(() => {
          // Falha silenciosa na reprodução
        });
      });
      
      audio.load();
    } catch (error) {
      // Falha silenciosa
    }
  }, []);

  return { playSound };
};
