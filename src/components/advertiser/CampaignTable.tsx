
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CampaignTableRow from "./CampaignTableRow";

interface Campaign {
  id: number;
  title: string;
  status: string;
  audience: string;
  completions: number;
  reward: string;
  expires: string;
}

interface CampaignTableProps {
  campaigns: Campaign[];
  onDelete: (id: number) => void;
}

const CampaignTable = ({ campaigns, onDelete }: CampaignTableProps) => {
  return (
    <div className="rounded-lg border border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Público</TableHead>
              <TableHead className="text-right">Completadas</TableHead>
              <TableHead>Pontos</TableHead>
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
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CampaignTable;
