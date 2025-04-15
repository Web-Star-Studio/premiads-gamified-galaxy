
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit, Eye, Trash } from "lucide-react";
import CampaignStatusBadge from "./CampaignStatusBadge";

interface Campaign {
  id: number;
  title: string;
  status: string;
  audience: string;
  completions: number;
  reward: string;
  expires: string;
}

interface CampaignTableRowProps {
  campaign: Campaign;
  onDelete: (id: number) => void;
}

const CampaignTableRow = ({ campaign, onDelete }: CampaignTableRowProps) => {
  return (
    <TableRow key={campaign.id}>
      <TableCell className="font-medium">{campaign.title}</TableCell>
      <TableCell>
        <CampaignStatusBadge status={campaign.status} />
      </TableCell>
      <TableCell>{campaign.audience}</TableCell>
      <TableCell className="text-right">{campaign.completions}</TableCell>
      <TableCell>{campaign.reward}</TableCell>
      <TableCell>{campaign.expires}</TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-400 hover:text-white"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-400 hover:text-neon-cyan"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-400 hover:text-red-500"
            onClick={() => onDelete(campaign.id)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default CampaignTableRow;
