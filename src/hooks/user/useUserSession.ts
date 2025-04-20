
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useUserSession = () => {
  const [authError, setAuthError] = useState<string | null>(null);
  const [fetchAttempts, setFetchAttempts] = useState(0);
  const { toast } = useToast();

  const handleExtendSession = () => {
    toast({
      title: "Sessão estendida",
      description: "Sua sessão foi estendida com sucesso.",
    });
  };

  const handleSessionTimeout = (navigate?: (path: string) => void) => {
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
    authError,
    setAuthError,
    fetchAttempts,
    setFetchAttempts,
    handleExtendSession,
    handleSessionTimeout
  };
};
