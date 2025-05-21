
import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface CheckboxGroupProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  className?: string;
  children: React.ReactNode;
}

export const CheckboxGroup = React.forwardRef<
  HTMLDivElement,
  CheckboxGroupProps
>(({ value, onValueChange, className, children, ...props }, ref) => {
  // Context to share the checkbox group state
  const CheckboxGroupContext = React.createContext<{
    value: string[];
    onValueChange: (value: string[]) => void;
  }>({
    value: [],
    onValueChange: () => undefined,
  });

  return (
    <CheckboxGroupContext.Provider value={{ value, onValueChange }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {children}
      </div>
    </CheckboxGroupContext.Provider>
  );
});
CheckboxGroup.displayName = "CheckboxGroup";

// Export the context for use in child components
export const useCheckboxGroupContext = () => {
  const context = React.useContext(
    React.createContext<{
      value: string[];
      onValueChange: (value: string[]) => void;
    }>({
      value: [],
      onValueChange: () => undefined,
    })
  );
  
  if (!context) {
    throw new Error("Checkbox must be used within a CheckboxGroup");
  }
  
  return context;
};
