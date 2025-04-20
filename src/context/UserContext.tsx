
import { createContext, useContext, useState, ReactNode } from "react";
import { UserType } from "@/types/auth";

type UserContextType = {
  userName: string;
  userType: UserType;
  isOverlayOpen: boolean;
  setUserName: (name: string) => void;
  setUserType: (type: UserType) => void;
  setIsOverlayOpen: (isOpen: boolean) => void;
  resetUserInfo: () => void;
};

const defaultContext: UserContextType = {
  userName: "",
  userType: "participante",
  isOverlayOpen: false,
  setUserName: () => {},
  setUserType: () => {},
  setIsOverlayOpen: () => {},
  resetUserInfo: () => {},
};

const UserContext = createContext<UserContextType>(defaultContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userName, setUserName] = useState<string>("");
  const [userType, setUserType] = useState<UserType>("participante");
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false);

  const resetUserInfo = () => {
    setUserName("");
    setUserType("participante");
    setIsOverlayOpen(false);
  };

  return (
    <UserContext.Provider
      value={{
        userName,
        userType,
        isOverlayOpen,
        setUserName,
        setUserType,
        setIsOverlayOpen,
        resetUserInfo,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
