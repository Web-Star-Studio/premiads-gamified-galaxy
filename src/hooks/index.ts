
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import { useUser } from "@/context/UserContext";
import { useSounds } from "./use-sounds";
import { useMissions } from "./useMissions";
import { useMediaQuery } from "./use-mobile";
import { useClientDashboard } from "./useClientDashboard";
import { useTheme } from "./use-theme";

// Re-export all hooks
export {
  useAuth,
  useToast,
  useSounds,
  useUser,
  useMissions,
  useMediaQuery,
  useClientDashboard,
  useTheme
};

// Re-export types using 'export type'
export type { Mission } from "./missions/types";
