
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { UserType } from "@/types/auth";
import { useUserState } from "./UserStateContext";
import { useUserSessionManager } from "./UserSessionManager";
import { useUserProfileOperations } from "./UserProfileOperations";
import { useNavigate } from "react-router-dom";

// The main UserContext type that combines all relevant context values 
type UserContextType = {
  userName: string;
  userType: UserType;
  isOverlayOpen: boolean;
  isAuthenticated: boolean;
  setUserName: (name: string) => void;
  setUserType: (type: UserType) => void;
  setIsOverlayOpen: (isOpen: boolean) => void;
  setIsAuthenticated: (isAuth: boolean) => void;
  resetUserInfo: () => void;
  clearUserSession: () => void;
  saveUserPreferences: () => Promise<void>;
  isAuthLoading: boolean;
  authError: string | null;
  checkSession: (force?: boolean) => Promise<boolean>;
  initialCheckDone: boolean;
};

const UserContext = createContext<UserContextType>({
  userName: "",
  userType: "participante",
  isOverlayOpen: false,
  isAuthenticated: false,
  setUserName: () => {},
  setUserType: () => {},
  setIsOverlayOpen: () => {},
  setIsAuthenticated: () => {},
  resetUserInfo: () => {},
  clearUserSession: () => {},
  saveUserPreferences: async () => {},
  isAuthLoading: false,
  authError: null,
  checkSession: async () => false,
  initialCheckDone: false,
});

export const useUser = () => useContext(UserContext);

