
import { memo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";

export interface NavigationItemProps {
  title: string;
  url: string;
  icon: LucideIcon;
  description: string;
}

const NavigationItem = ({ title, url, icon: Icon, description }: NavigationItemProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname === url;

  // Use useCallback to prevent recreating this function on every render
  const handleNavigate = useCallback(() => {
    navigate(url);
  }, [navigate, url]);

  return (
    <SidebarMenuItem key={title}>
      <SidebarMenuButton 
        isActive={isActive}
        asChild
        tooltip={description}
      >
        <Button
          variant="ghost"
          className={`w-full justify-start gap-2 h-10 px-3 text-base ${
            isActive ? "bg-galaxy-purple/20" : ""
          }`}
          onClick={handleNavigate}
        >
          <Icon className={isActive ? "text-neon-pink" : ""} size={20} />
          <span>{title}</span>
        </Button>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

// Wrap with memo to prevent unnecessary re-renders
export default memo(NavigationItem);
