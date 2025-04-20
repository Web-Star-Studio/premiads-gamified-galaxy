
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { UserType } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";

export const useAuthRedirection = (user: User | null, userType: UserType | null) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Handle redirections based on user type
  useEffect(() => {
    if (user && userType) {
      // Get the intended destination from router state, if any
      const from = (location.state as any)?.from || '/';
      
      // Check if user is trying to access their allowed routes
      const isAllowedRoute = (
        (userType === 'anunciante' && from.startsWith('/anunciante')) ||
        (userType === 'admin' && from.startsWith('/admin')) ||
        (userType === 'participante' && from.startsWith('/cliente'))
      );

      if (isAllowedRoute) {
        // Navigate to the intended destination
        navigate(from, { replace: true });
      } else {
        // Redirect based on user type to their default dashboard
        switch (userType) {
          case "anunciante":
            navigate("/anunciante", { replace: true });
            break;
          case "admin":
            navigate("/admin", { replace: true });
            break;
          default:
            navigate("/cliente", { replace: true });
        }

        // Show welcome toast
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo ao seu painel ${userType}!`
        });
      }
    }
  }, [user, userType, navigate, location, toast]);

  return { navigate };
};
