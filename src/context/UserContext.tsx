
import { createContext, useContext, useState, ReactNode } from "react";
import { UserType } from "@/types/auth";

type UserContextType = {
  userName: string;
  userType: UserType;
  setUserName: (name: string) => void;
  setUserType: (type: UserType) => void;
  resetUserInfo: () => void;
};

const defaultContext: UserContextType = {
  userName: "",
  userType: "participante",
  setUserName: () => {},
  setUserType: () => {},
  resetUserInfo: () => {},
};

const UserContext = createContext<UserContextType>(defaultContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userName, setUserName] = useState<string>("");
  const [userType, setUserType] = useState<UserType>("participante");

  const resetUserInfo = () => {
    setUserName("");
    setUserType("participante");
  };

  return (
    <UserContext.Provider
      value={{
        userName,
        userType,
        setUserName,
        setUserType,
        resetUserInfo,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
