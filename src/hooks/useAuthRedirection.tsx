
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { UserType } from "@/types/auth";

export const useAuthRedirection = (user: User | null, userType: UserType | null) => {
  const navigate = useNavigate();

  // Handle redirections based on user type
  useEffect(() => {
    if (user && userType) {
      if (userType === "anunciante") {
        navigate("/anunciante");
      } else {
        navigate("/cliente");
      }
    }
  }, [user, userType, navigate]);

  return { navigate };
};
