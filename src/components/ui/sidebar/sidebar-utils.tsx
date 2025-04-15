import * as React from "react";
import { cn } from "@/lib/utils";

// Export utility functions for sidebar
export function createSidebarClassName(baseClassName: string, additionalClassName?: string) {
  return cn(baseClassName, additionalClassName);
}

// Other utility functions can be added here as needed
