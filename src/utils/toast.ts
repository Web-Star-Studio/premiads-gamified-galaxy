
import { toast } from "@/hooks/use-toast";

// Standardized toast types
export type ToastType = "success" | "error" | "warning" | "info";

// Standardized toast function
export const showToast = (
  title: string, 
  description?: string, 
  type: ToastType = "info"
) => {
  return toast({
    title,
    description,
    variant: type === "error" ? "destructive" : "default",
  });
};

// Shorthand methods
export const toastSuccess = (title: string, description?: string) => 
  showToast(title, description, "success");

export const toastError = (title: string, description?: string) => 
  showToast(title, description, "error");

export const toastWarning = (title: string, description?: string) => 
  showToast(title, description, "warning");

export const toastInfo = (title: string, description?: string) => 
  showToast(title, description, "info");
