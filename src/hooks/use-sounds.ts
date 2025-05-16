import { useCallback } from "react";

type SoundType = "success" | "error" | "notification" | "click" | "reward" | "pop" | "chime";

export const useSounds = () => {
  const playSound = useCallback((type: SoundType) => {
    // Usar o caminho base do Vite
    const baseUrl = import.meta.env.BASE_URL || "/";
    let soundUrl: string;
    
    switch (type) {
      case "success":
        soundUrl = `${baseUrl}sounds/success.mp3`;
        break;
      case "error":
        soundUrl = `${baseUrl}sounds/error.mp3`;
        break;
      case "notification":
        soundUrl = `${baseUrl}sounds/notification.mp3`;
        break;
      case "click":
        soundUrl = `${baseUrl}sounds/click.mp3`;
        break;
      case "reward":
        soundUrl = `${baseUrl}sounds/reward.mp3`;
        break;
      case "pop":
        soundUrl = `${baseUrl}sounds/pop.mp3`;
        break;
      case "chime":
        soundUrl = `${baseUrl}sounds/chime.mp3`;
        break;
      default:
        soundUrl = `${baseUrl}sounds/click.mp3`;
    }
    
    try {
      // Verificar se estamos em ambiente de desenvolvimento
      if (import.meta.env.DEV) {
        // Em desenvolvimento, usar o caminho absoluto para o servidor Vite
        const devServerUrl = import.meta.env.VITE_DEV_SERVER_URL || "";
        if (devServerUrl) {
          soundUrl = `${devServerUrl}${soundUrl.startsWith('/') ? soundUrl.substring(1) : soundUrl}`;
        }
      }
      
      const audio = new Audio(soundUrl);
      audio.volume = 0.5; // Set volume to 50%
      
      // Adicionar um listener para erros de carregamento
      audio.addEventListener('error', (e) => {
        console.error(`Error loading sound ${soundUrl}:`, e);
      });
      
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
