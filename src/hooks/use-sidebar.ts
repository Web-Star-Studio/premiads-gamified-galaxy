
import { useContext } from "react";
import { SidebarContext } from "@/components/ui/sidebar/sidebar-context";

/**
 * Custom hook para acessar o contexto do sidebar.
 * @returns O contexto do sidebar com métodos e estado
 * @throws Error se usado fora do SidebarProvider
 */
export function useSidebar() {
  const context = useContext(SidebarContext);
  
  if (!context) {
    throw new Error("useSidebar deve ser usado dentro de um SidebarProvider");
  }
  
  return context;
}
