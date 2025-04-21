
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarFooter as Footer } from "@/components/ui/sidebar";
import { signOutAndCleanup } from "@/utils/auth"; // Use a função robusta diretamente

export const SidebarFooter = () => {
  const handleSignOut = async () => {
    await signOutAndCleanup(); // Use nossa função robusta de logout
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
