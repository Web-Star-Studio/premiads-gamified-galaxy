
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const useSessionManagement = (navigate?: NavigateFunction) => {
  const { toast } = useToast();

  const handleExtendSession = () => {
    toast({
      title: "Sessão estendida",
      description: "Sua sessão foi estendida com sucesso.",
    });
  };

  const handleSessionTimeout = () => {
    toast({
      title: "Sessão expirada",
      description: "Você foi desconectado devido à inatividade.",
      variant: "destructive",
    });
    if (navigate) {
      navigate("/");
    }
  };

  return {
    handleExtendSession,
    handleSessionTimeout,
  };
};
