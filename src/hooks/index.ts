
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import { useUser } from "@/context/UserContext";
import { useSounds } from "./use-sounds";
import { useMissions } from "./useMissions";
import { useMediaQuery } from "./use-mobile";
import { useClientDashboard } from "./useClientDashboard";
import { useTheme } from "./use-theme";
import { useAdminProfile } from "./admin/useAdminProfile";
import { useAdminAvatarUpload } from "./admin/useAdminAvatarUpload";

// Re-export all hooks
export {
  useAuth,
  useToast,
  useSounds,
  useUser,
  useMissions,
  useMediaQuery,
  useClientDashboard,
  useTheme,
  useAdminProfile,
  useAdminAvatarUpload
};

// Re-export types using 'export type'
export type { Mission } from "./missions/types";
