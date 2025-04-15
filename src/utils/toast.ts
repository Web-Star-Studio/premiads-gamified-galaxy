
import { toast } from "@/hooks/use-toast";

/**
 * Mostra uma mensagem de toast informativa
 * @param title Título da mensagem
 * @param description Descrição detalhada (opcional)
 */
export const toastInfo = (title: string, description?: string) => {
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
 */
export const toastSuccess = (title: string, description?: string) => {
  toast({
    title,
    description,
    variant: "success",
  });
};

/**
 * Mostra uma mensagem de toast de erro
 * @param title Título da mensagem
 * @param description Descrição detalhada (opcional)
 */
export const toastError = (title: string, description?: string) => {
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
 */
export const toastWarning = (title: string, description?: string) => {
  toast({
    title,
    description,
    variant: "warning",
  });
};
