
import { toast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";

/**
 * Mostra uma mensagem de toast informativa
 * @param title Título da mensagem
 * @param description Descrição detalhada (opcional)
 * @param playSound Flag para determinar se deve tocar som (padrão: true)
 */
export const toastInfo = (title: string, description?: string, playSound: boolean = true) => {
  if (playSound) {
    const { playSound: playSoundFn } = useSounds();
    playSoundFn("notification");
  }
  
  toast({
    title,
    description,
    variant: "default",
  });
};

/**
 * Mostra uma mensagem de toast de sucesso
 * @param title Título da mensagem
 * @param description Descrição detalhada (opcional)
 * @param playSound Flag para determinar se deve tocar som (padrão: true)
 */
export const toastSuccess = (title: string, description?: string, playSound: boolean = true) => {
  if (playSound) {
    const { playSound: playSoundFn } = useSounds();
    playSoundFn("success");
  }
  
  toast({
    title,
    description,
    variant: "default",
  });
};

/**
 * Mostra uma mensagem de toast de erro
 * @param title Título da mensagem
 * @param description Descrição detalhada (opcional)
 * @param playSound Flag para determinar se deve tocar som (padrão: true)
 */
export const toastError = (title: string, description?: string, playSound: boolean = true) => {
  if (playSound) {
    const { playSound: playSoundFn } = useSounds();
    playSoundFn("error");
  }
  
  toast({
    title,
    description,
    variant: "destructive",
  });
};

/**
 * Mostra uma mensagem de toast de aviso
 * @param title Título da mensagem
 * @param description Descrição detalhada (opcional)
 * @param playSound Flag para determinar se deve tocar som (padrão: true)
 */
export const toastWarning = (title: string, description?: string, playSound: boolean = true) => {
  if (playSound) {
    const { playSound: playSoundFn } = useSounds();
    playSoundFn("notification");
  }
  
  toast({
    title,
    description,
    variant: "default",
  });
};
