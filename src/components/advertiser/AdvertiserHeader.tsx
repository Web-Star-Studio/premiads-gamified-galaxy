
import { FC } from "react";
import { ClientDashboardHeader } from "@/components/client/ClientDashboardHeader";

export interface AdvertiserHeaderProps {
  title: string;
  description?: string;
  userName: string;
  showBackButton?: boolean;
  backTo?: string;
  onBackClick?: () => void;
  className?: string;
  titleClassName?: string;
}

const AdvertiserHeader: FC<AdvertiserHeaderProps> = (props) => {
  return <ClientDashboardHeader {...props} />;
};

export default AdvertiserHeader;
