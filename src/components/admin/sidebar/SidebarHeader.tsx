
import { Menu } from "lucide-react";
import { SidebarHeader as Header, SidebarTrigger } from "@/components/ui/sidebar";

export const SidebarHeader = () => {
  return (
    <Header className="flex items-center justify-between p-4 pt-6">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-galaxy-purple flex items-center justify-center">
          <span className="text-white font-bold">A</span>
        </div>
        <div className="text-lg font-bold font-heading neon-text-pink">Admin</div>
      </div>
      <SidebarTrigger>
        <Menu className="w-5 h-5 text-gray-400" />
      </SidebarTrigger>
    </Header>
  );
};

export default SidebarHeader;
