
import { VariantProps } from "class-variance-authority";
import { sidebarMenuButtonVariants } from "./sidebar-menu";

// We need to make sure the SidebarContext type is properly exported
export type SidebarContext = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

export const SIDEBAR_COOKIE_NAME = "sidebar:state";
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export const SIDEBAR_WIDTH = "16rem";
export const SIDEBAR_WIDTH_MOBILE = "18rem";
export const SIDEBAR_WIDTH_ICON = "4rem"; // Increased from 3rem to 4rem for better icon display
export const SIDEBAR_KEYBOARD_SHORTCUT = "b";

export interface SidebarMenuButtonProps extends React.ComponentProps<"button"> {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<any>;
  variant?: VariantProps<typeof sidebarMenuButtonVariants>["variant"];
  size?: VariantProps<typeof sidebarMenuButtonVariants>["size"];
}
