
import { Loader2 } from "lucide-react";
import { LucideProps } from "lucide-react";
import React from "react";

/**
 * Reusable icon components for use throughout the application
 */
export const Icons = {
  spinner: React.forwardRef<SVGSVGElement, LucideProps>(
    ({ className, ...props }, ref) => (
      <Loader2
        ref={ref}
        className={className || "h-4 w-4 animate-spin"}
        {...props}
      />
    )
  ),
};

