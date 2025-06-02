
import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface CheckboxGroupProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  className?: string;
  children: React.ReactNode;
}

// Create the context
const CheckboxGroupContext = React.createContext<{
  value: string[];
  onValueChange: (value: string[]) => void;
}>({
  value: [],
  onValueChange: () => undefined,
});

// Hook to use the context
export const useCheckboxGroupContext = () => {
  const context = React.useContext(CheckboxGroupContext);
  
  if (!context) {
    throw new Error("Checkbox must be used within a CheckboxGroup");
  }
  
  return context;
};

export const CheckboxGroup = React.forwardRef<
  HTMLDivElement,
  CheckboxGroupProps
>(({ value, onValueChange, className, children, ...props }, ref) => (
    <CheckboxGroupContext.Provider value={{ value, onValueChange }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {children}
      </div>
    </CheckboxGroupContext.Provider>
  ));
CheckboxGroup.displayName = "CheckboxGroup";
