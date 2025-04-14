
import React, { createContext, useContext, useState, ReactNode } from "react";

type UserType = "participante" | "anunciante";

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
  const [userType, setUserType] = useState<UserType>("participante");
  const [userName, setUserName] = useState("");
  const [isOverlayOpen, setIsOverlayOpen] = useState(true);

  const resetUserInfo = () => {
    setUserName("");
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
