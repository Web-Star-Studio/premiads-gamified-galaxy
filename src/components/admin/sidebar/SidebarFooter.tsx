
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarFooter as Footer } from "@/components/ui/sidebar";
import { useAuthMethods } from "@/hooks/useAuthMethods";

export const SidebarFooter = () => {
  const { signOut } = useAuthMethods();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      console.log("Signed out successfully from SidebarFooter");
    } catch (error) {
      console.error("Error signing out from SidebarFooter:", error);
    }
  };
  
  return (
    <Footer className="p-4">
      <Button 
        variant="ghost" 
        className="w-full justify-start gap-2 text-gray-400 hover:text-white"
        onClick={handleSignOut}
      >
        <LogOut className="w-4 h-4" />
        <span>Sair</span>
      </Button>
    </Footer>
  );
};

export default SidebarFooter;
