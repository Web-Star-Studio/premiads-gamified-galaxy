
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { UserType } from "@/types/auth";

interface UserContextType {
  userType: UserType;
  userName: string;
  isOverlayOpen: boolean;
  setUserType: (type: UserType) => void;
  setUserName: (name: string) => void;
  setIsOverlayOpen: (isOpen: boolean) => void;
  resetUserInfo: () => void;
}

const defaultContextValue: UserContextType = {
  userType: "participante",
  userName: "",
  isOverlayOpen: true,
  setUserType: () => {},
  setUserName: () => {},
  setIsOverlayOpen: () => {},
  resetUserInfo: () => {},
};

const UserContext = createContext<UserContextType>(defaultContextValue);

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage if available
  const [userType, setUserTypeState] = useState<UserType>(() => {
    const savedType = localStorage.getItem("userType");
    return (savedType as UserType) || "participante";
  });
  
  const [userName, setUserNameState] = useState<string>(() => localStorage.getItem("userName") || "");
  
  const [isOverlayOpen, setIsOverlayOpenState] = useState<boolean>(() => {
    // Show overlay if no username is set
    const savedName = localStorage.getItem("userName");
    return !savedName || savedName === "";
  });

  // Update localStorage when state changes
  const setUserType = (type: UserType) => {
    localStorage.setItem("userType", type);
    setUserTypeState(type);
  };

  const setUserName = (name: string) => {
    localStorage.setItem("userName", name);
    setUserNameState(name);
  };

  const setIsOverlayOpen = (isOpen: boolean) => {
    setIsOverlayOpenState(isOpen);
  };

  const resetUserInfo = () => {
    localStorage.removeItem("userName");
    setUserNameState("");
    setIsOverlayOpen(true);
  };

  return (
    <UserContext.Provider
      value={{
        userType,
        userName,
        isOverlayOpen,
        setUserType,
        setUserName,
        setIsOverlayOpen,
        resetUserInfo,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
