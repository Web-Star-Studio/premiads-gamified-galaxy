
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
    className: type === "success" ? "bg-green-100 border-green-200 text-green-800" : 
               type === "warning" ? "bg-yellow-100 border-yellow-200 text-yellow-800" :
               type === "info" ? "bg-blue-100 border-blue-200 text-blue-800" : undefined
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
