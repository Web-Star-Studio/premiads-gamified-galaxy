
import { FC, useEffect, memo } from "react";
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
import { useSidebar } from "@/hooks/use-sidebar";
import { useMediaQuery } from "@/hooks/use-mobile";

interface AdminSidebarProps {
  className?: string;
}

/**
 * Admin panel sidebar with navigation and user profile
 * Automatically collapses on mobile devices
 */
const AdminSidebar: FC<AdminSidebarProps> = ({ className = "" }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { setOpen } = useSidebar();
  
  // Close sidebar on mobile by default
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile, setOpen]);
  
  return (
    <Sidebar 
      className={`border-r border-galaxy-purple/30 bg-galaxy-dark ${className}`}
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

export default memo(AdminSidebar);
