
import { TableCell, TableRow } from "@/components/ui/table";
import { Campaign } from "./campaignData";
import CampaignStatusBadge from "./CampaignStatusBadge";
import { AlertTriangle, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CampaignTableRowProps {
  campaign: Campaign;
  onDelete: (id: string | number) => void;
  onEdit: (campaign: Campaign) => void;
}

const CampaignTableRow = ({ campaign, onDelete, onEdit }: CampaignTableRowProps) => {
  const isExpiring = campaign.status === "ativa" && 
    campaign.expires !== "N/A" && 
    new Date(campaign.expires) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  
  return (
    <TableRow className="border-b border-gray-800">
      <TableCell className="font-medium">
        {campaign.title}
        {isExpiring && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertTriangle className="w-4 h-4 text-amber-400 ml-2 inline" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Esta campanha irá expirar em breve</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </TableCell>
      <TableCell>
        <CampaignStatusBadge status={campaign.status} />
      </TableCell>
      <TableCell>{campaign.audience}</TableCell>
      <TableCell className="text-right">{campaign.completions}</TableCell>
      <TableCell>{campaign.reward}</TableCell>
      <TableCell>{campaign.expires}</TableCell>
      <TableCell className="text-right space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(campaign)}
          className="h-8 w-8"
          aria-label="Editar campanha"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(campaign.id)}
          className="h-8 w-8 hover:text-red-500"
          aria-label="Excluir campanha"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default CampaignTableRow;
