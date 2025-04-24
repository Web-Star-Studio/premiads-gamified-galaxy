
import { ReactNode } from "react";
import { UserType } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserType[];
}

const RoleGuard = ({ children }: RoleGuardProps) => {
  const { currentUser, isLoading } = useAuth();
  
  if (isLoading) {
    return null;
  }
  
  // Temporarily allow all authenticated users
  if (currentUser) {
    return <>{children}</>;
  }
  
  return null;
};

export default RoleGuard;
