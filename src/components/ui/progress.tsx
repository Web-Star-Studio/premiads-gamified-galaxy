
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    indicatorClassName?: string;
    variant?: "default" | "gradient" | "success" | "warning";
  }
>(({ className, value, indicatorClassName, variant = "default", ...props }, ref) => {
  // Variant classes for progress indicators
  const variantClasses = {
    default: "bg-primary",
    gradient: "bg-gradient-to-r from-neon-cyan to-neon-pink",
    success: "bg-neon-lime",
    warning: "bg-neon-red"
  }
  
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary/20",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 transition-all", 
          variantClasses[variant],
          indicatorClassName
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      >
        <div className="absolute inset-0 bg-white/10" />
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
