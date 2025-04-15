
import { 
  Sidebar, 
  SidebarContent
} from "@/components/ui/sidebar";
import { 
  SidebarHeader, 
  SidebarFooter, 
  NavigationItems,
  UserProfile
} from "./sidebar";
import { useMediaQuery } from "@/hooks/use-mobile";

export const AdminSidebar = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <Sidebar 
      className="border-r border-galaxy-purple/30 bg-galaxy-dark"
      variant="sidebar"
      collapsible="icon"
    >
      <SidebarHeader />

      <SidebarContent className="px-2">
        <div className="mb-6">
          <UserProfile />
        </div>

        <NavigationItems />
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
};

export default AdminSidebar;
