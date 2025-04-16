
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit, Eye, Trash, BarChart } from "lucide-react";
import CampaignStatusBadge from "./CampaignStatusBadge";
import { Campaign } from "./campaignData";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { useSounds } from "@/hooks/use-sounds";

interface CampaignTableRowProps {
  campaign: Campaign;
  onDelete: (id: number) => void;
  onEdit: (campaign: Campaign) => void;
}

const CampaignTableRow = ({ campaign, onDelete, onEdit }: CampaignTableRowProps) => {
  const navigate = useNavigate();
  const { playSound } = useSounds();

  const handleViewDetails = () => {
    navigate(`/anunciante/campanhas/${campaign.id}`);
    playSound("pop");
  };

  const handleEditCampaign = () => {
    navigate(`/anunciante/campanhas/editar/${campaign.id}`);
    playSound("pop");
    onEdit(campaign);
  };

  const handleViewAnalytics = () => {
    navigate(`/anunciante/analises/campanha/${campaign.id}`);
    playSound("pop");
  };

  const handleDelete = () => {
    onDelete(campaign.id);
  };

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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-400 hover:text-white"
                onClick={handleViewDetails}
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
                onClick={handleEditCampaign}
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
                onClick={handleViewAnalytics}
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
                onClick={handleDelete}
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
