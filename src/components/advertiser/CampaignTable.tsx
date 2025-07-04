import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CampaignTableRow from "./CampaignTableRow";
import { Campaign } from "./campaignData";

interface CampaignTableProps {
  campaigns: Campaign[];
  onDelete: (id: string) => void; // Changed from number to string to match campaign.id type
  onEdit: (campaign: Campaign) => void;
  onViewDetails: (campaignId: string) => void;
}

const CampaignTable = ({ campaigns, onDelete, onEdit, onViewDetails }: CampaignTableProps) => (
    <div className="rounded-lg border border-gray-800 overflow-hidden">
      {campaigns.length === 0 ? (
        <div className="py-8 text-center text-gray-400">
          <p>Nenhuma campanha encontrada</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Público</TableHead>
                <TableHead className="text-right">Completadas</TableHead>
                <TableHead>Rifas</TableHead>
                <TableHead>Expira</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <CampaignTableRow 
                  key={campaign.id}
                  campaign={campaign} 
                  onDelete={onDelete} 
                  onEdit={onEdit}
                  onViewDetails={onViewDetails}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );

export default CampaignTable;
