
import React, { createContext, useContext, useReducer, ReactNode } from "react";

// Define the state structure
interface AppState {
  darkMode: boolean;
  sidebarOpen: boolean;
  notifications: number;
  lastUpdated: string | null;
}

// Define action types
type AppAction = 
  | { type: "TOGGLE_DARK_MODE" }
  | { type: "SET_SIDEBAR_OPEN"; payload: boolean }
  | { type: "INCREMENT_NOTIFICATIONS" }
  | { type: "CLEAR_NOTIFICATIONS" }
  | { type: "SET_LAST_UPDATED"; payload: string };

// Initial state
const initialState: AppState = {
  darkMode: localStorage.getItem("darkMode") === "true",
  sidebarOpen: true,
  notifications: 0,
  lastUpdated: null,
};

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "TOGGLE_DARK_MODE":
      const newDarkMode = !state.darkMode;
      localStorage.setItem("darkMode", String(newDarkMode));
      return { ...state, darkMode: newDarkMode };
    
    case "SET_SIDEBAR_OPEN":
      return { ...state, sidebarOpen: action.payload };
      
    case "INCREMENT_NOTIFICATIONS":
      return { ...state, notifications: state.notifications + 1 };
      
    case "CLEAR_NOTIFICATIONS":
      return { ...state, notifications: 0 };
      
    case "SET_LAST_UPDATED":
      return { ...state, lastUpdated: action.payload };
      
    default:
      return state;
  }
};

// Create context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

// Utility hooks for common actions
export const useToggleDarkMode = () => {
  const { dispatch } = useAppContext();
  return () => dispatch({ type: "TOGGLE_DARK_MODE" });
};

export const useSidebarControl = () => {
  const { state, dispatch } = useAppContext();
  return {
    isOpen: state.sidebarOpen,
    toggle: () => dispatch({ type: "SET_SIDEBAR_OPEN", payload: !state.sidebarOpen }),
    open: () => dispatch({ type: "SET_SIDEBAR_OPEN", payload: true }),
    close: () => dispatch({ type: "SET_SIDEBAR_OPEN", payload: false }),
  };
};

export const useNotifications = () => {
  const { state, dispatch } = useAppContext();
  return {
    count: state.notifications,
    increment: () => dispatch({ type: "INCREMENT_NOTIFICATIONS" }),
    clear: () => dispatch({ type: "CLEAR_NOTIFICATIONS" }),
  };
};
