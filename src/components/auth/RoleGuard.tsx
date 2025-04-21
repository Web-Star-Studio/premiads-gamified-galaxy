
import { ReactNode } from "react";
import { UserType } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserType[];
}

const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const { currentUser, isLoading } = useAuth();
  
  if (isLoading) {
    return null;
  }
  
  const userType = currentUser?.user_metadata?.user_type as UserType;
  
  if (!userType || !allowedRoles.includes(userType)) {
    // Redirect based on user type
    if (userType === "anunciante") {
      return <Navigate to="/anunciante" />;
    } else if (userType === "participante") {
      return <Navigate to="/cliente" />;
    } else {
      return <Navigate to="/auth" />;
    }
  }
  
  return <>{children}</>;
};

export default RoleGuard;
