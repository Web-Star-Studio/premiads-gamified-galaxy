
import { useCallback } from 'react';

type SoundType = 'pop' | 'success' | 'error' | 'notification' | 'reward' | 'chime' | 'click';

export const useSounds = () => {
  const playSound = useCallback((soundType: SoundType) => {
    try {
      const audio = new Audio(`/sounds/${soundType}.mp3`);
      
      // Adicionar tratamento de erro silencioso
      audio.addEventListener('error', (e) => {
        // Falha silenciosa - não loggar erro no console
        if (e && typeof e === 'object' && 'preventDefault' in e) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
      
      audio.addEventListener('canplaythrough', () => {
        audio.play().catch((e) => {
          // Falha silenciosa na reprodução
          console.debug('Audio play failed silently:', e);
        });
      });
      
      // Verificar se o arquivo existe antes de tentar carregar
      audio.onerror = (e) => {
        if (e && typeof e === 'object' && 'preventDefault' in e) {
          e.preventDefault();
          e.stopPropagation();
        }
        return false;
      };
      
      audio.load();
    } catch (error) {
      // Falha silenciosa
      console.debug('Sound initialization failed silently:', error);
    }
  }, []);

  return { playSound };
};
