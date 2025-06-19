import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarFooter as Footer } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { safeLogoutWithFallback } from "@/utils/auth";

export const SidebarFooter = () => {
  const { signOut } = useAuth();
  
  return (
    <Footer className="p-4">
      <Button 
        variant="ghost" 
        className="w-full justify-start gap-2 text-gray-400 hover:text-white"
        onClick={async () => {
          await safeLogoutWithFallback(signOut);
        }}
      >
        <LogOut className="w-4 h-4" />
        <span>Sair</span>
      </Button>
    </Footer>
  );
};

export default SidebarFooter;
