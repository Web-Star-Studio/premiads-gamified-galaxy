
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
  defaultOpen?: boolean;
  className?: string;
}

const AdminSidebar: FC<AdminSidebarProps> = ({ 
  defaultOpen = true,
  className = "" 
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { open, setOpen } = useSidebar();
  
  // Close sidebar on mobile by default
  useEffect(() => {
    if (isMobile && defaultOpen === undefined) {
      setOpen(false);
    }
  }, [isMobile, defaultOpen, setOpen]);
  
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

// Use memo to prevent unnecessary re-renders
export default memo(AdminSidebar);
