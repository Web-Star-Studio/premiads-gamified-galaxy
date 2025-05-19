
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit, Eye, Trash, BarChart } from "lucide-react";
import CampaignStatusBadge from "./CampaignStatusBadge";
import { Campaign } from "./campaignData";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Mission } from "@/hooks/missions/types"; 

interface CampaignTableRowProps {
  campaign: Campaign;
  onDelete: (id: string) => void; 
  onEdit: (campaign: Campaign) => void;
}

const CampaignTableRow = ({ campaign, onDelete, onEdit }: CampaignTableRowProps) => {
  // Use optional chaining to safely access properties that might not exist
  const audience = campaign.audience || (campaign as any).target_audience || 'Todos';
  const completions = typeof campaign.completions === 'number' ? campaign.completions : 0;
  const reward = campaign.reward || `${campaign.points} pontos`;
  const expires = campaign.expires || ((campaign as any).end_date ? new Date((campaign as any).end_date).toLocaleDateString() : 'N/A');

  return (
    <TableRow key={campaign.id}>
      <TableCell className="font-medium">{campaign.title}</TableCell>
      <TableCell>
        <CampaignStatusBadge status={campaign.status} />
      </TableCell>
      <TableCell>{audience}</TableCell>
      <TableCell className="text-right">{completions}</TableCell>
      <TableCell>{reward}</TableCell>
      <TableCell>{expires}</TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-400 hover:text-white"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ver detalhes</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-400 hover:text-neon-cyan"
                onClick={() => onEdit(campaign)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Editar campanha</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-400 hover:text-neon-pink"
              >
                <BarChart className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ver analytics</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-400 hover:text-red-500"
                onClick={() => onDelete(campaign.id)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Excluir campanha</TooltipContent>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default CampaignTableRow;
