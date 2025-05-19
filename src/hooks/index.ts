
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import { useUser } from "@/context/UserContext";
import { useSounds } from "./use-sounds";
import { useMissions } from "./useMissions";
import { useRaffles } from "./useRaffles";
import { useCashback } from "./useCashback";
import { useMediaQuery } from "./use-mobile";
import { useClientDashboard } from "./useClientDashboard";
import { useClientProfile } from "./useClientProfile";
import { useTheme } from "./use-theme";

// Re-export all hooks
export {
  useAuth,
  useToast,
  useSounds,
  useUser,
  useMissions,
  useRaffles,
  useCashback,
  useMediaQuery,
  useClientDashboard,
  useClientProfile,
  useTheme
};

// Re-export types using 'export type'
export type { Mission } from "./missions/types";
