
import { cn } from "@/lib/utils";

/**
 * Helper functions for consistent styling across all panels
 */

export const getPanelCardStyles = (variant: "default" | "secondary" | "glass" = "default") => {
  return cn(
    "border rounded-lg overflow-hidden",
    variant === "default" && "border-galaxy-purple/30 bg-galaxy-deepPurple/30",
    variant === "secondary" && "border-galaxy-blue/30 bg-galaxy-deepPurple/20",
    variant === "glass" && "backdrop-blur-md bg-white/5 border-white/10"
  );
};

export const getPanelHeaderStyles = () => {
  return "flex items-center justify-between p-4 border-b border-galaxy-purple/30 bg-gradient-to-r from-galaxy-purple/20 to-galaxy-blue/20";
};

export const getPanelButtonStyles = (variant: "primary" | "secondary" | "ghost" = "primary") => {
  return cn(
    variant === "primary" && "bg-neon-cyan text-galaxy-dark hover:bg-neon-cyan/80",
    variant === "secondary" && "bg-galaxy-purple text-white hover:bg-galaxy-purple/80",
    variant === "ghost" && "bg-transparent hover:bg-white/5 text-white"
  );
};
