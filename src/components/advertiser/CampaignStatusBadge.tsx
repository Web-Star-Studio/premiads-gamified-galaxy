
import { Badge } from "@/components/ui/badge";

interface CampaignStatusBadgeProps {
  status: string;
}

const CampaignStatusBadge = ({ status }: CampaignStatusBadgeProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativa":
        return "bg-green-500/20 text-green-500 border-green-500/50";
      case "pendente":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
      case "encerrada":
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
      default:
        return "bg-blue-500/20 text-blue-500 border-blue-500/50";
    }
  };

  return (
    <Badge className={`${getStatusColor(status)}`}>
      {status}
    </Badge>
  );
};

export default CampaignStatusBadge;
